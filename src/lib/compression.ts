import type { OutputFormat } from '@/components/image-processor';
import * as avifEnc from '@jsquash/avif';
import * as jpegEnc from '@jsquash/jpeg';
import * as pngEnc from '@jsquash/png';
import * as webpEnc from '@jsquash/webp';
import * as jxl from '@jsquash/jxl';

export interface CompressionResult {
    data: Blob;
    size: number;
    compressionRatio: number;
    mimeType: string;
}

// Convert File to ImageData for processing
export async function fileToImageData(file: File): Promise<ImageData> {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Could not get canvas context');
    }

    ctx.drawImage(bitmap, 0, 0);
    return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
}

// Convert ImageData to Uint8Array for compression
export function imageDataToUint8Array(imageData: ImageData): Uint8Array {
    return new Uint8Array(imageData.data.buffer);
}

// Get proper mime type for the output format
export function getMimeType(format: OutputFormat): string {
    switch (format) {
        case 'AVIF':
            return 'image/avif';
        case 'JPEG':
            return 'image/jpeg';
        case 'JXL':
            return 'image/jxl';
        case 'PNG':
            return 'image/png';
        case 'WEBP':
            return 'image/webp';
        default:
            return 'image/jpeg';
    }
}

// Main compression function that handles different formats
export async function compressImage(
    file: File,
    format: OutputFormat,
    quality: number
): Promise<CompressionResult> {
    try {
        const imageData = await fileToImageData(file);
        let compressedData: Blob;
        const mimeType = getMimeType(format);

        switch (format) {
            case 'AVIF':
                const avifBuffer = await avifEnc.encode(imageData, { quality: quality / 100 });
                compressedData = new Blob([avifBuffer], { type: 'image/avif' });
                break;
            case 'JPEG':
                const jpegBuffer = await jpegEnc.encode(imageData, { quality });
                compressedData = new Blob([jpegBuffer], { type: 'image/jpeg' });
                break;
            case 'JXL':
                const jxlBuffer = await jxl.encode(imageData, { quality: quality / 100 });
                compressedData = new Blob([jxlBuffer], { type: 'image/jxl' });
                break;
            case 'PNG':
                const pngBuffer = await pngEnc.encode(imageData);
                compressedData = new Blob([pngBuffer], { type: 'image/png' });
                break;
            case 'WEBP':
                const webpBuffer = await webpEnc.encode(imageData, { quality });
                compressedData = new Blob([webpBuffer], { type: 'image/webp' });
                break;
            default:
                throw new Error(`Unsupported format: ${format}`);
        }

        const compressionRatio = calculateCompressionRatio(file.size, compressedData.size);

        return {
            data: compressedData,
            size: compressedData.size,
            compressionRatio,
            mimeType
        };
    } catch (error) {
        console.error('Image compression error:', error);
        throw error;
    }
}

// Calculate compression ratio as percentage saved
export function calculateCompressionRatio(originalSize: number, compressedSize: number): number {
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}

// Format file size in human-readable form
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Get a file extension for the given format
export function getFileExtension(format: OutputFormat): string {
    switch (format) {
        case 'AVIF': return 'avif';
        case 'JPEG': return 'jpg';
        case 'JXL': return 'jxl';
        case 'PNG': return 'png';
        case 'WEBP': return 'webp';
        default: return 'jpg';
    }
}
