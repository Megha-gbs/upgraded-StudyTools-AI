'use client'

import { useCallback, useState } from 'react'
import { useDropzone, type Accept } from 'react-dropzone'
import { Upload, FileIcon, X, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface FileWithPreview extends File {
  preview?: string
}

interface FileDropzoneProps {
  accept?: Accept
  maxFiles?: number
  maxSize?: number
  onFilesChange: (files: FileWithPreview[]) => void
  files: FileWithPreview[]
  label?: string
  description?: string
  className?: string
  disabled?: boolean
}

export function FileDropzone({
  accept,
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB default
  onFilesChange,
  files,
  label = 'Drop files here',
  description = 'or click to browse',
  className,
  disabled = false,
}: FileDropzoneProps) {
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: { file: File; errors: { message: string }[] }[]) => {
      setError(null)

      if (rejectedFiles.length > 0) {
        const firstError = rejectedFiles[0].errors[0]
        setError(firstError.message)
        return
      }

      if (files.length + acceptedFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`)
        return
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: file.type.startsWith('image/')
            ? URL.createObjectURL(file)
            : undefined,
        })
      )

      onFilesChange([...files, ...newFiles])
    },
    [files, maxFiles, onFilesChange]
  )

  const removeFile = (index: number) => {
    const newFiles = [...files]
    const removed = newFiles.splice(index, 1)
    if (removed[0]?.preview) {
      URL.revokeObjectURL(removed[0].preview)
    }
    onFilesChange(newFiles)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    disabled,
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
          disabled && 'cursor-not-allowed opacity-50',
          error && 'border-destructive'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              'flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-transform',
              isDragActive && 'scale-110'
            )}
          >
            <Upload
              className={cn(
                'h-8 w-8 text-primary transition-transform',
                isDragActive && 'animate-bounce'
              )}
            />
          </div>
          <div>
            <p className="text-lg font-medium">{label}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Max {maxFiles} files, up to {formatFileSize(maxSize)} each
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {files.length} file{files.length !== 1 ? 's' : ''} selected
          </p>
          <div className="grid gap-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 rounded-lg border bg-card p-3"
              >
                {file.preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                    <FileIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 truncate">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  className="h-8 w-8 shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
