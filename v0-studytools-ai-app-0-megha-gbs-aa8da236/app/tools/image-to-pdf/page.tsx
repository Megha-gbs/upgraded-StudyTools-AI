'use client'

import { useState, useCallback } from 'react'
import { jsPDF } from 'jspdf'
import { GripVertical, Download, Trash2, Loader2 } from 'lucide-react'
import { ToolLayout } from '@/components/tool-layout'
import { FileDropzone, type FileWithPreview } from '@/components/file-dropzone'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

type PageSize = 'a4' | 'letter' | 'fit'
type Orientation = 'portrait' | 'landscape' | 'auto'

const pageSizeLabels: Record<PageSize, string> = {
  a4: 'A4',
  letter: 'Letter',
  fit: 'Fit to Image',
}

export default function ImageToPdfPage() {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [pageSize, setPageSize] = useState<PageSize>('a4')
  const [orientation, setOrientation] = useState<Orientation>('auto')
  const [converting, setConverting] = useState(false)
  const [progress, setProgress] = useState(0)

  const moveFile = useCallback((fromIndex: number, toIndex: number) => {
    setFiles((prev) => {
      const newFiles = [...prev]
      const [removed] = newFiles.splice(fromIndex, 1)
      newFiles.splice(toIndex, 0, removed)
      return newFiles
    })
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index)
      if (prev[index]?.preview) {
        URL.revokeObjectURL(prev[index].preview!)
      }
      return newFiles
    })
  }, [])

  const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }

  const convertToPdf = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one image')
      return
    }

    setConverting(true)
    setProgress(0)

    try {
      let pdf: jsPDF | null = null

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const img = await loadImage(file)

        const imgWidth = img.naturalWidth
        const imgHeight = img.naturalHeight
        const imgRatio = imgWidth / imgHeight

        let pageWidth: number
        let pageHeight: number
        let isLandscape = false

        // Determine orientation
        if (orientation === 'auto') {
          isLandscape = imgWidth > imgHeight
        } else {
          isLandscape = orientation === 'landscape'
        }

        // Set page dimensions
        if (pageSize === 'fit') {
          // Use image dimensions (converted to mm, assuming 96 DPI)
          pageWidth = imgWidth * 0.264583
          pageHeight = imgHeight * 0.264583
        } else {
          const dimensions =
            pageSize === 'a4'
              ? { width: 210, height: 297 }
              : { width: 215.9, height: 279.4 }

          if (isLandscape) {
            pageWidth = dimensions.height
            pageHeight = dimensions.width
          } else {
            pageWidth = dimensions.width
            pageHeight = dimensions.height
          }
        }

        if (i === 0) {
          pdf = new jsPDF({
            orientation: isLandscape ? 'landscape' : 'portrait',
            unit: 'mm',
            format: pageSize === 'fit' ? [pageWidth, pageHeight] : pageSize,
          })
        } else if (pdf) {
          pdf.addPage(
            pageSize === 'fit' ? [pageWidth, pageHeight] : pageSize,
            isLandscape ? 'landscape' : 'portrait'
          )
        }

        if (!pdf) continue

        // Calculate image dimensions to fit page
        let finalWidth: number
        let finalHeight: number
        let x = 0
        let y = 0

        if (pageSize === 'fit') {
          finalWidth = pageWidth
          finalHeight = pageHeight
        } else {
          const margin = 10
          const maxWidth = pageWidth - margin * 2
          const maxHeight = pageHeight - margin * 2
          const pageRatio = maxWidth / maxHeight

          if (imgRatio > pageRatio) {
            finalWidth = maxWidth
            finalHeight = maxWidth / imgRatio
          } else {
            finalHeight = maxHeight
            finalWidth = maxHeight * imgRatio
          }

          x = (pageWidth - finalWidth) / 2
          y = (pageHeight - finalHeight) / 2
        }

        // Add image to PDF
        const canvas = document.createElement('canvas')
        canvas.width = imgWidth
        canvas.height = imgHeight
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95)

        pdf.addImage(dataUrl, 'JPEG', x, y, finalWidth, finalHeight)
        URL.revokeObjectURL(img.src)

        setProgress(((i + 1) / files.length) * 100)
      }

      if (pdf) {
        pdf.save('images.pdf')
        toast.success('PDF created successfully!')
        setFiles([])
      }
    } catch (error) {
      console.error('Error converting to PDF:', error)
      toast.error('Failed to convert images to PDF')
    } finally {
      setConverting(false)
      setProgress(0)
    }
  }

  return (
    <ToolLayout
      title="Image to PDF"
      description="Convert your images to PDF. Support for JPG, PNG, and more. Drag to reorder."
      category="pdf"
      toolName="Image to PDF"
    >
      <div className="space-y-6">
        <FileDropzone
          accept={{
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
            'image/gif': ['.gif'],
          }}
          maxFiles={30}
          onFilesChange={setFiles}
          files={files}
          label="Drop images here"
          description="JPG, PNG, WebP, GIF supported"
        />

        {files.length > 0 && (
          <div className="space-y-6">
            {/* Options */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Page Size</Label>
                <RadioGroup
                  value={pageSize}
                  onValueChange={(v) => setPageSize(v as PageSize)}
                  className="flex flex-wrap gap-2"
                >
                  {(['a4', 'letter', 'fit'] as PageSize[]).map((size) => (
                    <div key={size}>
                      <RadioGroupItem
                        value={size}
                        id={`size-${size}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`size-${size}`}
                        className="cursor-pointer rounded-md border px-4 py-2 hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      >
                        {pageSizeLabels[size]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Orientation</Label>
                <RadioGroup
                  value={orientation}
                  onValueChange={(v) => setOrientation(v as Orientation)}
                  className="flex flex-wrap gap-2"
                >
                  {(['auto', 'portrait', 'landscape'] as Orientation[]).map(
                    (o) => (
                      <div key={o}>
                        <RadioGroupItem
                          value={o}
                          id={`orient-${o}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`orient-${o}`}
                          className="cursor-pointer rounded-md border px-4 py-2 capitalize hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                        >
                          {o}
                        </Label>
                      </div>
                    )
                  )}
                </RadioGroup>
              </div>
            </div>

            {/* Image List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {files.length} image{files.length !== 1 ? 's' : ''} selected
                </p>
                <Button variant="outline" size="sm" onClick={() => setFiles([])}>
                  Clear All
                </Button>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="relative flex items-center gap-2 rounded-lg border bg-muted/50 p-2"
                  >
                    <button
                      className="cursor-grab text-muted-foreground hover:text-foreground"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        const startY = e.clientY
                        const startIndex = index

                        const handleMouseMove = (moveEvent: MouseEvent) => {
                          const deltaY = moveEvent.clientY - startY
                          const itemHeight = 80
                          const indexDelta = Math.round(deltaY / itemHeight)
                          const newIndex = Math.max(
                            0,
                            Math.min(files.length - 1, startIndex + indexDelta)
                          )
                          if (newIndex !== startIndex) {
                            moveFile(startIndex, newIndex)
                          }
                        }

                        const handleMouseUp = () => {
                          document.removeEventListener(
                            'mousemove',
                            handleMouseMove
                          )
                          document.removeEventListener('mouseup', handleMouseUp)
                        }

                        document.addEventListener('mousemove', handleMouseMove)
                        document.addEventListener('mouseup', handleMouseUp)
                      }}
                    >
                      <GripVertical className="h-4 w-4" />
                    </button>
                    {file.preview && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-medium">{file.name}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      className="h-7 w-7 shrink-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {converting && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-center text-sm text-muted-foreground">
                  Converting... {Math.round(progress)}%
                </p>
              </div>
            )}

            <Button
              onClick={convertToPdf}
              disabled={files.length === 0 || converting}
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
                  <Download className="mr-2 h-4 w-4" />
                  Convert to PDF
                </>
              )}
            </Button>
          </div>
        )}

        {/* Instructions */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <h3 className="font-semibold">How to use:</h3>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
            <li>Upload images (JPG, PNG, WebP, GIF)</li>
            <li>Drag and drop to reorder if needed</li>
            <li>Select page size and orientation</li>
            <li>Click &quot;Convert to PDF&quot; to download</li>
          </ol>
        </div>
      </div>
    </ToolLayout>
  )
}
