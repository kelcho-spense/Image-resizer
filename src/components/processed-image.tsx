"use client"

import { useState } from 'react';
import { Check, X, Download, Trash2, Loader2 } from "lucide-react"
import { saveAs } from 'file-saver';
import { formatFileSize, getFileExtension } from '@/lib/compression';
import type { ImageFile, OutputFormat } from './image-processor'

interface ProcessedImageProps {
  image: ImageFile
  onRemove: () => void
  format?: OutputFormat;
}

export function ProcessedImage({ image, onRemove, format = "WEBP" }: ProcessedImageProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!image.compressedBlob) return;

    setIsDownloading(true);
    try {
      const ext = getFileExtension(format);
      // Get filename without extension and add new extension
      const originalName = image.file.name.replace(/\.[^/.]+$/, "");
      const fileName = `${originalName}.${ext}`;

      saveAs(image.compressedBlob, fileName);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="border rounded-lg p-3 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
          <img
            src={image.preview}
            alt={image.file.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate" title={image.file.name}>
            {image.file.name}
          </h4>

          <div className="mt-1 flex items-center text-sm text-gray-500">
            <span>Original: {formatFileSize(image.file.size)}</span>

            {image.processed && image.compressedSize && (
              <>
                <span className="mx-1">→</span>
                <span className={`font-medium ${image.compressedSize < image.file.size ? 'text-green-600' : 'text-amber-600'}`}>
                  {formatFileSize(image.compressedSize)}
                  {image.compressionRatio !== undefined && image.compressionRatio > 0 && (
                    <span className="ml-1">(-{image.compressionRatio}%)</span>
                  )}
                </span>
              </>
            )}

            {image.processing && (
              <div className="flex items-center ml-2 text-amber-500">
                <Loader2 className="animate-spin mr-1 h-3 w-3" />
                <span>Processing...</span>
              </div>
            )}

            {image.processingError && (
              <div className="ml-2 text-red-500">
                Error: {image.processingError}
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          {image.processed && !image.processingError && (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            >
              {isDownloading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Download className="h-5 w-5" />
              )}
            </button>
          )}

          <button
            onClick={onRemove}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

