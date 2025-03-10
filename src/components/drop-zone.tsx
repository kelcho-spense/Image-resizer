import type React from "react"

import { useCallback, useState } from "react"
import { Upload } from "lucide-react"

interface DropZoneProps {
  onFilesAdded: (files: FileList) => void
}

export function DropZone({ onFilesAdded }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFilesAdded(e.dataTransfer.files)
      }
    },
    [onFilesAdded],
  )

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFilesAdded(e.target.files)
      }
    },
    [onFilesAdded],
  )

  return (
    <div
      className={`border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-input")?.click()}
    >
      <Upload className="w-12 h-12 text-gray-400 mb-4" />
      <p className="text-lg text-center mb-1">Drop images here or click to upload</p>
      <p className="text-sm text-gray-500">Supports JPEG, PNG, WebP, AVIF, and JXL</p>
      <input
        id="file-input"
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />
    </div>
  )
}

