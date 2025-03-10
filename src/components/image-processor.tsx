import { useState, useCallback, useEffect } from "react"
import { Download } from "lucide-react"
import { FormatSelector } from "./format-selector"
import { QualitySlider } from "./quality-slider"
import { DropZone } from "./drop-zone"
import { ProcessedImage } from "./processed-image"
import { nanoid } from 'nanoid'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { compressImage, formatFileSize, getFileExtension } from "@/lib/compression"

export type OutputFormat = "AVIF" | "JPEG" | "JXL" | "PNG" | "WEBP"

export type ImageFile = {
  id: string
  file: File
  preview: string
  processed: boolean
  processing: boolean
  processingError?: string
  compressedBlob?: Blob
  compressedSize?: number
  compressionRatio?: number
}

export function ImageProcessor() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("WEBP")
  const [quality, setQuality] = useState(75)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDownloadingAll, setIsDownloadingAll] = useState(false)

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(image => {
        URL.revokeObjectURL(image.preview)
      })
    }
  }, [images])

  const handleFilesAdded = useCallback((files: File[]) => {
    const newImages = files.map((file) => ({
      id: nanoid(),
      file,
      preview: URL.createObjectURL(file),
      processed: false,
      processing: false,
    }))

    setImages((prev) => [...prev, ...newImages])
  }, [])

  const handleRemoveImage = useCallback((id: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find(img => img.id === id)
      if (imageToRemove?.preview) {
        URL.revokeObjectURL(imageToRemove.preview)
      }
      return prev.filter((img) => img.id !== id)
    })
  }, [])

  const handleProcessImages = async () => {
    // Skip if already processing or no images
    if (isProcessing || images.length === 0) return
    setIsProcessing(true)

    try {
      const updatedImages = [...images]

      for (let i = 0; i < updatedImages.length; i++) {
        const image = updatedImages[i]

        // Skip already processed images
        if (image.processed) continue

        // Set image to processing state
        updatedImages[i] = { ...image, processing: true }
        setImages([...updatedImages])

        try {
          // Compress the image with selected format and quality
          const result = await compressImage(image.file, outputFormat, quality)

          // Update the image with compression results
          updatedImages[i] = {
            ...image,
            processed: true,
            processing: false,
            compressedBlob: result.data,
            compressedSize: result.size,
            compressionRatio: result.compressionRatio
          }
        } catch (error) {
          // Handle compression errors
          updatedImages[i] = {
            ...image,
            processed: true,
            processing: false,
            processingError: error instanceof Error ? error.message : 'Unknown error'
          }
        }

        // Update the state after each image
        setImages([...updatedImages])
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFormatChange = (format: OutputFormat) => {
    setOutputFormat(format)

    // Set default quality based on format
    if (format === 'PNG') {
      setQuality(100) // PNG is lossless
    } else if (format === 'AVIF') {
      setQuality(50) // AVIF works well with lower quality
    } else {
      setQuality(75) // Default for other formats
    }
  }

  const handleDownloadAll = async () => {
    const processedImages = images.filter(img => img.processed && img.compressedBlob && !img.processingError)
    if (processedImages.length === 0) return

    setIsDownloadingAll(true)

    try {
      // If only one image, download it directly
      if (processedImages.length === 1) {
        const image = processedImages[0]
        if (image.compressedBlob) {
          const originalName = image.file.name.replace(/\.[^/.]+$/, "")
          const ext = getFileExtension(outputFormat)
          saveAs(image.compressedBlob, `${originalName}.${ext}`)
        }
      } else {
        // Create a zip file for multiple images
        const zip = new JSZip()

        // Add each compressed image to the zip
        processedImages.forEach(image => {
          if (image.compressedBlob) {
            const originalName = image.file.name.replace(/\.[^/.]+$/, "")
            const ext = getFileExtension(outputFormat)
            zip.file(`${originalName}.${ext}`, image.compressedBlob)
          }
        })

        // Generate and download the zip file
        const zipBlob = await zip.generateAsync({ type: 'blob' })
        saveAs(zipBlob, `compressed_images.zip`)
      }
    } catch (error) {
      console.error('Error downloading files:', error)
    } finally {
      setIsDownloadingAll(false)
    }
  }

  // Calculate total stats
  const totalOriginalSize = images.reduce((sum, img) => sum + img.file.size, 0)
  const totalCompressedSize = images.reduce((sum, img) => sum + (img.compressedSize || 0), 0)
  const hasProcessedImages = images.some(img => img.processed && !img.processingError)

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-6">
        <h3 className="mb-2 font-medium">Output Format</h3>
        <FormatSelector value={outputFormat} onChange={handleFormatChange} />
      </div>

      <div className="mb-6">
        <h3 className="mb-2 font-medium">Quality: {quality}%</h3>
        <QualitySlider
          value={quality}
          onChange={setQuality}
          disabled={outputFormat === "PNG"} // PNG is always lossless
        />
        {outputFormat === "PNG" && (
          <p className="text-xs text-gray-500 mt-1">PNG compression is lossless</p>
        )}
      </div>

      <DropZone onFilesAdded={handleFilesAdded} disabled={isProcessing} />

      {images.length > 0 && (
        <>
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {images.length} image{images.length !== 1 ? 's' : ''}
              {hasProcessedImages && (
                <span className="ml-2">
                  ({formatFileSize(totalOriginalSize)} → {formatFileSize(totalCompressedSize)})
                </span>
              )}
            </div>

            <div className="space-x-3">
              <button
                className={`px-4 py-2 rounded-md ${isProcessing
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                onClick={handleProcessImages}
                disabled={isProcessing || images.length === 0}
              >
                {isProcessing ? 'Processing...' : 'Process Images'}
              </button>

              {hasProcessedImages && (
                <button
                  className={`px-4 py-2 rounded-md flex items-center gap-1 ${isDownloadingAll
                      ? 'bg-green-300 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  onClick={handleDownloadAll}
                  disabled={isDownloadingAll}
                >
                  <Download className="w-4 h-4" />
                  {isDownloadingAll ? 'Downloading...' : `Download All`}
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {images.map((image) => (
              <ProcessedImage
                key={image.id}
                image={image}
                onRemove={() => handleRemoveImage(image.id)}
                format={outputFormat}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

