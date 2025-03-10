"use client"

import { Check, X } from "lucide-react"
import type { ImageFile } from "./image-processor"

interface ProcessedImageProps {
  image: ImageFile
  onRemove: () => void
}

export function ProcessedImage({ image, onRemove }: ProcessedImageProps) {
  return (
    <div className="flex items-center p-2 border rounded-md">
      <img
        src={image.preview || "/placeholder.svg"}
        alt={image.file.name}
        className="w-12 h-12 object-cover rounded mr-3"
      />
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm">{image.file.name}</p>
        <div className="flex items-center text-sm">
          {image.processed ? (
            <span className="flex items-center text-green-600">
              <Check className="w-4 h-4 mr-1" /> Complete
            </span>
          ) : (
            <span className="text-gray-500">Processing...</span>
          )}
        </div>
      </div>
      <button onClick={onRemove} className="p-1 text-gray-500 hover:text-gray-700">
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}

