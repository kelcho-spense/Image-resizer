import { X, CheckCircle, AlertCircle, Loader2, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { ImageFile } from '../types';
import { formatFileSize, calculateCompressionRatio } from '../lib/compression';
import { downloadImage, downloadAllImages } from '../utils/download';

interface ImageListProps {
    images: ImageFile[];
    onRemove: (id: string) => void;
    onProcess?: (imageIds: string[]) => void;
    outputType: string;
    quality: number;
}

export function ImageList({
    images,
    onRemove,
    onProcess,
    outputType,
    quality
}: ImageListProps) {
    const [isDownloadingAll, setIsDownloadingAll] = useState(false);

    // Auto-process new pending images
    useEffect(() => {
        if (!onProcess) return;

        const pendingImageIds = images
            .filter(img => img.status === 'pending')
            .map(img => img.id);

        if (pendingImageIds.length > 0) {
            console.log(`Auto-processing ${pendingImageIds.length} new images with ${outputType} at quality ${quality}`);
            onProcess(pendingImageIds);
        }
    }, [images, onProcess, outputType, quality]);

    if (images.length === 0) return null;

    const completedImages = images.filter(img => img.status === 'complete' && img.blob);
    const hasCompletedImages = completedImages.length > 0;

    const handleDownloadAll = async () => {
        if (!hasCompletedImages || isDownloadingAll) return;

        setIsDownloadingAll(true);
        try {
            await downloadAllImages(images);
        } catch (error) {
            console.error('Failed to download all images:', error);
        } finally {
            setIsDownloadingAll(false);
        }
    };

    return (
        <div className="space-y-4">
            {hasCompletedImages && (
                <div className="flex justify-end mb-2">
                    <button
                        onClick={handleDownloadAll}
                        disabled={isDownloadingAll}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Download all processed images"
                    >
                        {isDownloadingAll ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Downloading...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                Download All ({completedImages.length})
                            </>
                        )}
                    </button>
                </div>
            )}

            {images.map((image) => (
                <div
                    key={image.id}
                    className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4"
                >
                    {image.preview && (
                        <img
                            src={image.preview}
                            alt={image.file.name}
                            className="w-16 h-16 object-cover rounded"
                        />
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {image.file.name}
                            </p>
                            <div className="flex items-center gap-2">
                                {image.status === 'complete' && image.blob && (
                                    <button
                                        onClick={() => downloadImage(image)}
                                        className="text-gray-400 hover:text-gray-600"
                                        title="Download"
                                        aria-label={`Download ${image.file.name}`}
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                )}
                                <button
                                    onClick={() => onRemove(image.id)}
                                    className="text-gray-400 hover:text-gray-600"
                                    title="Remove"
                                    aria-label={`Remove ${image.file.name}`}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                            {image.status === 'pending' && (
                                <span>Ready to process</span>
                            )}
                            {image.status === 'queued' && (
                                <span>Queued for processing</span>
                            )}
                            {image.status === 'processing' && (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Processing...
                                </span>
                            )}
                            {image.status === 'complete' && (
                                <span className="flex items-center gap-2 text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    Complete
                                </span>
                            )}
                            {image.status === 'error' && (
                                <span className="flex items-center gap-2 text-red-600">
                                    <AlertCircle className="w-4 h-4" />
                                    {image.error || 'Error processing image'}
                                </span>
                            )}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                            {formatFileSize(image.originalSize)}
                            {image.compressedSize && (
                                <>
                                    {' → '}
                                    {formatFileSize(image.compressedSize)}{' '}
                                    <span className={image.compressedSize < image.originalSize ? "text-green-600" : "text-amber-600"}>
                                        (
                                        {calculateCompressionRatio(image.originalSize, image.compressedSize)}
                                        % {image.compressedSize < image.originalSize ? "smaller" : "larger"})
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
