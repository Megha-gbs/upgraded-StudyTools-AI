'use client'

import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import JSZip from 'jszip'
import { Download, Loader2, FileText } from 'lucide-react'
import { ToolLayout } from '@/components/tool-layout'
import { FileDropzone, type FileWithPreview } from '@/components/file-dropzone'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

export default function SplitPdfPage() {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [selectedPages, setSelectedPages] = useState<number[]>([])
  const [pageRange, setPageRange] = useState('')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [splitMode, setSplitMode] = useState<'select' | 'range' | 'all'>('select')

  const loadPdf = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const pages = pdf.getPageCount()
      setTotalPages(pages)
      setSelectedPages([])
      setPageRange('')
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
      setSelectedPages([])
    }
  }

  const togglePage = (page: number) => {
    setSelectedPages((prev) =>
      prev.includes(page)
        ? prev.filter((p) => p !== page)
        : [...prev, page].sort((a, b) => a - b)
    )
  }

  const parsePageRange = (range: string): number[] => {
    const pages: Set<number> = new Set()
    const parts = range.split(',')

    for (const part of parts) {
      const trimmed = part.trim()
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(Number)
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
            pages.add(i)
          }
        }
      } else {
        const num = parseInt(trimmed, 10)
        if (!isNaN(num) && num >= 1 && num <= totalPages) {
          pages.add(num)
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b)
  }

  const getPagesToPextract = (): number[] => {
    if (splitMode === 'all') {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    } else if (splitMode === 'range') {
      return parsePageRange(pageRange)
    }
    return selectedPages
  }

  const splitPdf = async () => {
    const pagesToExtract = getPagesToPextract()

    if (pagesToExtract.length === 0) {
      toast.error('Please select at least one page to extract')
      return
    }

    if (files.length === 0) {
      toast.error('Please upload a PDF file first')
      return
    }

    setProcessing(true)
    setProgress(0)

    try {
      const file = files[0]
      const arrayBuffer = await file.arrayBuffer()
      const sourcePdf = await PDFDocument.load(arrayBuffer)

      if (splitMode === 'all') {
        // Split into individual pages and create ZIP
        const zip = new JSZip()

        for (let i = 0; i < totalPages; i++) {
          const newPdf = await PDFDocument.create()
          const [copiedPage] = await newPdf.copyPages(sourcePdf, [i])
          newPdf.addPage(copiedPage)

          const pdfBytes = await newPdf.save()
          zip.file(`page_${i + 1}.pdf`, pdfBytes)
          setProgress(((i + 1) / totalPages) * 80)
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' })
        const url = URL.createObjectURL(zipBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'split_pages.zip'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast.success(`Split into ${totalPages} individual PDFs!`)
      } else {
        // Extract selected pages into single PDF
        const newPdf = await PDFDocument.create()
        const pageIndices = pagesToExtract.map((p) => p - 1)

        const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices)
        copiedPages.forEach((page) => newPdf.addPage(page))

        setProgress(80)

        const pdfBytes = await newPdf.save()
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `extracted_pages.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast.success(`Extracted ${pagesToExtract.length} page(s)!`)
      }

      setProgress(100)
    } catch (error) {
      console.error('Error splitting PDF:', error)
      toast.error('Failed to split PDF. Please try again.')
    } finally {
      setProcessing(false)
      setProgress(0)
    }
  }

  return (
    <ToolLayout
      title="Split PDF"
      description="Extract specific pages from a PDF or split into individual page files."
      category="pdf"
      toolName="Split PDF"
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
                {totalPages} page{totalPages !== 1 ? 's' : ''} detected
              </span>
            </div>

            <Tabs
              value={splitMode}
              onValueChange={(v) => setSplitMode(v as typeof splitMode)}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="select">Select Pages</TabsTrigger>
                <TabsTrigger value="range">Page Range</TabsTrigger>
                <TabsTrigger value="all">Split All</TabsTrigger>
              </TabsList>

              <TabsContent value="select" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Click on pages to select them for extraction
                </p>
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => togglePage(page)}
                        className={`flex h-10 items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                          selectedPages.includes(page)
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'hover:border-primary/50 hover:bg-muted'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                {selectedPages.length > 0 && (
                  <p className="text-sm">
                    Selected: {selectedPages.join(', ')}
                  </p>
                )}
              </TabsContent>

              <TabsContent value="range" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="range">Page Range</Label>
                  <Input
                    id="range"
                    placeholder="e.g., 1-3, 5, 7-10"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter page numbers separated by commas, or ranges with hyphens
                  </p>
                </div>
                {pageRange && (
                  <p className="text-sm">
                    Will extract: {parsePageRange(pageRange).join(', ') || 'None'}
                  </p>
                )}
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                <div className="flex items-start gap-3 rounded-lg border p-4">
                  <Checkbox id="confirm-all" defaultChecked />
                  <div>
                    <Label htmlFor="confirm-all" className="font-medium">
                      Split into individual pages
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Each page will become a separate PDF file, downloaded as a
                      ZIP archive
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {processing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-center text-sm text-muted-foreground">
                  Processing... {Math.round(progress)}%
                </p>
              </div>
            )}

            <Button
              onClick={splitPdf}
              disabled={
                processing ||
                (splitMode === 'select' && selectedPages.length === 0) ||
                (splitMode === 'range' && parsePageRange(pageRange).length === 0)
              }
              className="w-full"
              size="lg"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  {splitMode === 'all'
                    ? `Split All ${totalPages} Pages`
                    : 'Extract Selected Pages'}
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
            <li>Choose extraction mode: select pages, enter range, or split all</li>
            <li>Click the button to extract and download</li>
          </ol>
        </div>
      </div>
    </ToolLayout>
  )
}
