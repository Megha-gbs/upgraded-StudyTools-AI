'use client'

import { useState, useCallback } from 'react'
import { PDFDocument } from 'pdf-lib'
import { GripVertical, Download, Trash2, Loader2 } from 'lucide-react'
import { ToolLayout } from '@/components/tool-layout'
import { FileDropzone, type FileWithPreview } from '@/components/file-dropzone'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

export default function MergePdfPage() {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [merging, setMerging] = useState(false)
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
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const mergePdfs = async () => {
    if (files.length < 2) {
      toast.error('Please select at least 2 PDF files to merge')
      return
    }

    setMerging(true)
    setProgress(0)

    try {
      const mergedPdf = await PDFDocument.create()
      const totalFiles = files.length

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        pages.forEach((page) => mergedPdf.addPage(page))
        setProgress(((i + 1) / totalFiles) * 100)
      }

      const mergedPdfBytes = await mergedPdf.save()
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = 'merged.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('PDFs merged successfully!')
      setFiles([])
    } catch (error) {
      console.error('Error merging PDFs:', error)
      toast.error('Failed to merge PDFs. Please check your files and try again.')
    } finally {
      setMerging(false)
      setProgress(0)
    }
  }

  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into a single document. Drag and drop to reorder."
      category="pdf"
      toolName="Merge PDF"
    >
      <div className="space-y-6">
        <FileDropzone
          accept={{ 'application/pdf': ['.pdf'] }}
          maxFiles={20}
          onFilesChange={setFiles}
          files={files}
          label="Drop PDF files here"
          description="or click to browse. You can add multiple files."
        />

        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {files.length} file{files.length !== 1 ? 's' : ''} selected
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiles([])}
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3"
                >
                  <button
                    className="cursor-grab text-muted-foreground hover:text-foreground"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      const startY = e.clientY
                      const startIndex = index

                      const handleMouseMove = (moveEvent: MouseEvent) => {
                        const deltaY = moveEvent.clientY - startY
                        const itemHeight = 56
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
                        document.removeEventListener('mousemove', handleMouseMove)
                        document.removeEventListener('mouseup', handleMouseUp)
                      }

                      document.addEventListener('mousemove', handleMouseMove)
                      document.addEventListener('mouseup', handleMouseUp)
                    }}
                  >
                    <GripVertical className="h-5 w-5" />
                  </button>
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-sm font-medium text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 truncate">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {merging && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-center text-sm text-muted-foreground">
                  Merging PDFs... {Math.round(progress)}%
                </p>
              </div>
            )}

            <Button
              onClick={mergePdfs}
              disabled={files.length < 2 || merging}
              className="w-full"
              size="lg"
            >
              {merging ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Merging...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Merge & Download
                </>
              )}
            </Button>
          </div>
        )}

        {/* Instructions */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <h3 className="font-semibold">How to use:</h3>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
            <li>Upload 2 or more PDF files using the dropzone above</li>
            <li>Drag and drop to reorder the files as needed</li>
            <li>Click &quot;Merge & Download&quot; to combine and save</li>
          </ol>
        </div>
      </div>
    </ToolLayout>
  )
}
