import { useState, useCallback } from "react"
import { Download } from "lucide-react"
import { FormatSelector } from "./format-selector"
import { QualitySlider } from "./quality-slider"
import { DropZone } from "./drop-zone"
import { ProcessedImage } from "./processed-image"

export type ImageFile = {
  id: string
  file: File
  preview: string
  processed: boolean
  processingError?: string
}

export type OutputFormat = "AVIF" | "JPEG" | "JXL" | "PNG" | "WEBP"

export function ImageProcessor() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("AVIF")
  const [quality, setQuality] = useState(50)

  const handleFilesAdded = useCallback((files: FileList) => {
    const newImages = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      processed: false,
    }))

    setImages((prev) => [...prev, ...newImages])

    // Simulate processing
    setTimeout(() => {
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          processed: true,
        })),
      )
    }, 1500)
  }, [])

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleDownloadAll = () => {
    // In a real app, this would download the processed images
    alert("Downloading all processed images")
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-6">
        <h3 className="mb-2 font-medium">Output Format</h3>
        <FormatSelector value={outputFormat} onChange={setOutputFormat} />
      </div>

      <div className="mb-6">
        <h3 className="mb-2 font-medium">Quality: {quality}%</h3>
        <QualitySlider value={quality} onChange={setQuality} />
      </div>

      <DropZone onFilesAdded={handleFilesAdded} />

      {images.length > 0 && (
        <>
          <button
            className="w-full mt-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center justify-center gap-2"
            onClick={handleDownloadAll}
          >
            <Download className="w-5 h-5" />
            Download All ({images.length} images)
          </button>

          <div className="mt-6 space-y-3">
            {images.map((image) => (
              <ProcessedImage key={image.id} image={image} onRemove={() => handleRemoveImage(image.id)} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

