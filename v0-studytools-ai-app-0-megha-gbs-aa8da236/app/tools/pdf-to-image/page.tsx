'use client'

import { useState, useEffect, useRef } from 'react'
import JSZip from 'jszip'
import { Loader2, FileText, Image as ImageIcon } from 'lucide-react'
import { ToolLayout } from '@/components/tool-layout'
import { FileDropzone, type FileWithPreview } from '@/components/file-dropzone'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'

// We'll load pdfjs dynamically to avoid SSR issues
type PDFJSLib = typeof import('pdfjs-dist')
let pdfjsLib: PDFJSLib | null = null

type ImageFormat = 'png' | 'jpeg'

export default function PdfToImagePage() {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [format, setFormat] = useState<ImageFormat>('png')
  const [quality, setQuality] = useState([90])
  const [scale, setScale] = useState([2])
  const [converting, setConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [isLibLoaded, setIsLibLoaded] = useState(false)
  const initRef = useRef(false)

  // Load pdfjs library dynamically on client side
  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    const loadPdfJs = async () => {
      try {
        const pdfjs = await import('pdfjs-dist')
        // Use the legacy build which has the worker bundled
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString()
        pdfjsLib = pdfjs
        setIsLibLoaded(true)
      } catch (error) {
        console.error('Failed to load PDF.js:', error)
        toast.error('Failed to initialize PDF viewer')
      }
    }

    loadPdfJs()
  }, [])

  const loadPdf = async (file: File) => {
    if (!pdfjsLib) {
      toast.error('PDF library is still loading...')
      return
    }
    
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      setTotalPages(pdf.numPages)
      setPreviewImages([])
    } catch (error) {
      console.error('Error loading PDF:', error)
      toast.error('Failed to load PDF. Please check the file.')
    }
  }

  const handleFilesChange = async (newFiles: FileWithPreview[]) => {
    setFiles(newFiles)
    if (newFiles.length > 0) {
      await loadPdf(newFiles[0])
    } else {
      setTotalPages(0)
      setPreviewImages([])
    }
  }

  const convertToImages = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file first')
      return
    }

    if (!pdfjsLib) {
      toast.error('PDF library is still loading...')
      return
    }

    setConverting(true)
    setProgress(0)
    setPreviewImages([])

    try {
      const file = files[0]
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

      const images: { name: string; blob: Blob }[] = []
      const previews: string[] = []

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: scale[0] })

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')!
        canvas.height = viewport.height
        canvas.width = viewport.width

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise

        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg'
        const dataUrl = canvas.toDataURL(mimeType, quality[0] / 100)
        previews.push(dataUrl)

        // Convert to blob
        const response = await fetch(dataUrl)
        const blob = await response.blob()

        images.push({
          name: `page_${i}.${format}`,
          blob,
        })

        setProgress((i / pdf.numPages) * 100)
      }

      setPreviewImages(previews)

      // Download as ZIP if multiple pages, or single file if one page
      if (images.length === 1) {
        const url = URL.createObjectURL(images[0].blob)
        const link = document.createElement('a')
        link.href = url
        link.download = images[0].name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else {
        const zip = new JSZip()
        images.forEach((img) => {
          zip.file(img.name, img.blob)
        })

        const zipBlob = await zip.generateAsync({ type: 'blob' })
        const url = URL.createObjectURL(zipBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'pdf_images.zip'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }

      toast.success(`Converted ${images.length} page(s) to images!`)
    } catch (error) {
      console.error('Error converting PDF:', error)
      toast.error('Failed to convert PDF. Please try again.')
    } finally {
      setConverting(false)
      setProgress(0)
    }
  }

  return (
    <ToolLayout
      title="PDF to Image"
      description="Convert PDF pages to high-quality JPG or PNG images."
      category="pdf"
      toolName="PDF to Image"
    >
      <div className="space-y-6">
        <FileDropzone
          accept={{ 'application/pdf': ['.pdf'] }}
          maxFiles={1}
          onFilesChange={handleFilesChange}
          files={files}
          label="Drop a PDF file here"
          description="or click to browse"
        />

        {totalPages > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium">
                {totalPages} page{totalPages !== 1 ? 's' : ''} will be converted
              </span>
            </div>

            {/* Options */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Image Format</Label>
                <RadioGroup
                  value={format}
                  onValueChange={(v) => setFormat(v as ImageFormat)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="png" id="png" />
                    <Label htmlFor="png" className="cursor-pointer">
                      PNG (Lossless)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="jpeg" id="jpeg" />
                    <Label htmlFor="jpeg" className="cursor-pointer">
                      JPEG (Smaller)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Scale: {scale[0]}x
                </Label>
                <Slider
                  value={scale}
                  onValueChange={setScale}
                  min={1}
                  max={4}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Higher scale = larger, sharper images
                </p>
              </div>

              {format === 'jpeg' && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Quality: {quality[0]}%
                  </Label>
                  <Slider
                    value={quality}
                    onValueChange={setQuality}
                    min={10}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {converting && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-center text-sm text-muted-foreground">
                  Converting... {Math.round(progress)}%
                </p>
              </div>
            )}

            {/* Preview */}
            {previewImages.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">Preview</Label>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {previewImages.slice(0, 6).map((src, index) => (
                    <div
                      key={index}
                      className="relative aspect-[3/4] overflow-hidden rounded-lg border bg-muted"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`Page ${index + 1}`}
                        className="h-full w-full object-contain"
                      />
                      <div className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-1 text-xs font-medium">
                        Page {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                {previewImages.length > 6 && (
                  <p className="text-center text-sm text-muted-foreground">
                    +{previewImages.length - 6} more pages
                  </p>
                )}
              </div>
            )}

            <Button
              onClick={convertToImages}
              disabled={converting}
              className="w-full"
              size="lg"
            >
              {converting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Convert to {format.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        )}

        {/* Instructions */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <h3 className="font-semibold">How to use:</h3>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
            <li>Upload a PDF file</li>
            <li>Choose image format (PNG or JPEG)</li>
            <li>Adjust scale and quality settings</li>
            <li>Click convert to download images</li>
          </ol>
        </div>
      </div>
    </ToolLayout>
  )
}
