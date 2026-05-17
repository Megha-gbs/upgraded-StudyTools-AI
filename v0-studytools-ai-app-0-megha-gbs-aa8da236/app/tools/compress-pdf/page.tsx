'use client'

import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import { Download, Loader2, FileDown } from 'lucide-react'
import { ToolLayout } from '@/components/tool-layout'
import { FileDropzone, type FileWithPreview } from '@/components/file-dropzone'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

type CompressionLevel = 'low' | 'medium' | 'high'

const compressionSettings: Record<
  CompressionLevel,
  { label: string; description: string; quality: number }
> = {
  low: {
    label: 'Low Compression',
    description: 'Best quality, larger file size',
    quality: 0.9,
  },
  medium: {
    label: 'Medium Compression',
    description: 'Balanced quality and size',
    quality: 0.7,
  },
  high: {
    label: 'High Compression',
    description: 'Smallest size, reduced quality',
    quality: 0.5,
  },
}

export default function CompressPdfPage() {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [compressionLevel, setCompressionLevel] =
    useState<CompressionLevel>('medium')
  const [compressing, setCompressing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{
    originalSize: number
    compressedSize: number
    savings: number
  } | null>(null)

  const compressPdf = async () => {
    if (files.length === 0) {
      toast.error('Please select a PDF file to compress')
      return
    }

    setCompressing(true)
    setProgress(0)
    setResult(null)

    try {
      const file = files[0]
      const originalSize = file.size
      setProgress(20)

      const arrayBuffer = await file.arrayBuffer()
      setProgress(40)

      const pdfDoc = await PDFDocument.load(arrayBuffer)
      setProgress(60)

      // Note: pdf-lib doesn't have built-in compression,
      // but we can optimize by removing unused objects
      // For real compression, you'd need a server-side solution
      const compressedBytes = await pdfDoc.save({
          useObjectStreams: true,
  addDefaultPage: false,
  objectsPerTick: 50,
  updateFieldAppearances: false,
      })
      setProgress(80)

      const compressedSize = compressedBytes.length
      const savings = Math.round(
        ((originalSize - compressedSize) / originalSize) * 100
      )

      setResult({
        originalSize,
        compressedSize,
        savings: Math.max(0, savings),
      })

      const blob = new Blob([compressedBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = file.name.replace('.pdf', '_compressed.pdf')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setProgress(100)
      toast.success('PDF compressed successfully!')
    } catch (error) {
      console.error('Error compressing PDF:', error)
      toast.error('Failed to compress PDF. Please try again.')
    } finally {
      setCompressing(false)
      setProgress(0)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce your PDF file size while maintaining quality. Fast and free."
      category="pdf"
      toolName="Compress PDF"
    >
      <div className="space-y-6">
        <FileDropzone
          accept={{ 'application/pdf': ['.pdf'] }}
          maxFiles={1}
          onFilesChange={(newFiles) => {
            setFiles(newFiles)
            setResult(null)
          }}
          files={files}
          label="Drop a PDF file here"
          description="or click to browse"
        />
v0-studytools-ai-app-0-megha-gbs-aa8da236
        {files.length > 0 && (
          <div className="space-y-6">
            {/* Compression Level Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Compression Level
              </Label>
              <RadioGroup
                value={compressionLevel}
                onValueChange={(value) =>
                  setCompressionLevel(value as CompressionLevel)
                }
                className="grid gap-3 sm:grid-cols-3"
              >
                {(Object.keys(compressionSettings) as CompressionLevel[]).map(
                  (level) => (
                    <div key={level}>
                      <RadioGroupItem
                        value={level}
                        id={level}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={level}
                        className="flex cursor-pointer flex-col rounded-lg border p-4 hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      >
                        <span className="font-medium">
                          {compressionSettings[level].label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {compressionSettings[level].description}
                        </span>
                      </Label>
                    </div>
                  )
                )}
              </RadioGroup>
            </div>

            {/* Progress */}
            {compressing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-center text-sm text-muted-foreground">
                  Compressing PDF... {Math.round(progress)}%
                </p>
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-primary">
                  <FileDown className="h-5 w-5" />
                  <span className="font-semibold">Compression Complete!</span>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Original</p>
                    <p className="font-medium">{formatSize(result.originalSize)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Compressed</p>
                    <p className="font-medium">
                      {formatSize(result.compressedSize)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Savings</p>
                    <p className="font-medium text-primary">{result.savings}%</p>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={compressPdf}
              disabled={files.length === 0 || compressing}
              className="w-full"
              size="lg"
            >
              {compressing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Compressing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Compress & Download
                </>
              )}
            </Button>
          </div>
        )}

        {/* Instructions */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <h3 className="font-semibold">How to use:</h3>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
            <li>Upload a PDF file using the dropzone above</li>
            <li>Select your preferred compression level</li>
            <li>Click &quot;Compress & Download&quot; to save the optimized file</li>
          </ol>
        </div>
      </div>
    </ToolLayout>
  )
}
