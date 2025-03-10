import type { OutputFormat } from '@/components/image-processor';
import type {
    OutputType,
    ImageFile,
    CompressionOptions
} from '../types';
import type {
    AvifEncodeOptions,
    JpegEncodeOptions,
    JxlEncodeOptions,
    WebpEncodeOptions
} from '../types/encoders';
import * as avifEnc from '@jsquash/avif';
import * as jpegEnc from '@jsquash/jpeg';
import * as pngEnc from '@jsquash/png';
import * as webpEnc from '@jsquash/webp';
import * as jxl from '@jsquash/jxl';
import { ensureWasmLoaded } from './wasm';

// Keep track of encoder states
export type EncoderState = 'uninitiated' | 'loading' | 'available' | 'failed';

export const encoderStates: Record<OutputFormat, EncoderState> = {
    'AVIF': 'uninitiated',
    'JPEG': 'uninitiated',
    'JXL': 'uninitiated',
    'PNG': 'uninitiated',
    'WEBP': 'uninitiated'
};

export const availableEncoders: Record<OutputFormat, boolean> = {
    'AVIF': false,
    'JPEG': false,
    'JXL': false,
    'PNG': false,
    'WEBP': false
};

// Convert OutputFormat to OutputType
function formatToType(format: OutputFormat): OutputType {
    switch (format) {
        case 'AVIF': return 'avif';
        case 'JPEG': return 'jpeg';
        case 'JXL': return 'jxl';
        case 'PNG': return 'png';
        case 'WEBP': return 'webp';
    }
}

let initializationComplete = false;

// Use the wasm.ts ensureWasmLoaded function
export async function initializeEncoders(timeoutMs = 10000): Promise<void> {
    try {
        console.log('Initializing image encoders...');

        Object.keys(encoderStates).forEach(format => {
            encoderStates[format as OutputFormat] = 'loading';
        });

        const initializeEncoder = async (
            format: OutputFormat,
            timeout: number
        ) => {
            try {
                const outputType = formatToType(format);

                // Create a timeout promise
                const timeoutPromise = new Promise<void>((_, reject) => {
                    setTimeout(() => reject(new Error(`Timeout initializing ${format} encoder`)), timeout);
                });

                // Race the WASM loading against timeout
                await Promise.race([ensureWasmLoaded(outputType), timeoutPromise]);

                availableEncoders[format] = true;
                encoderStates[format] = 'available';
                console.log(`${format} encoder initialized successfully`);
            } catch (e) {
                encoderStates[format] = 'failed';
                console.error(`Failed to initialize ${format} encoder:`, e);
            }
        };

        const initPromises = [
            initializeEncoder('AVIF', timeoutMs),
            initializeEncoder('JPEG', timeoutMs),
            initializeEncoder('JXL', timeoutMs),
            initializeEncoder('PNG', timeoutMs),
            initializeEncoder('WEBP', timeoutMs)
        ];

        await Promise.all(initPromises);

        console.log('Available encoders:', Object.entries(availableEncoders)
            .filter(([_, available]) => available)
            .map(([format]) => format)
            .join(', '));

        initializationComplete = true;
    } catch (error) {
        console.error('Error initializing encoders:', error);
    } finally {
        initializationComplete = true;
    }
}



export function isInitializationComplete(): boolean {
    return initializationComplete;
}

export async function ensureEncoderLoaded(format: OutputFormat): Promise<boolean> {
    if (availableEncoders[format]) {
        return true;
    }

    if (encoderStates[format] === 'loading') {
        return false;
    }

    try {
        encoderStates[format] = 'loading';
        console.log(`Dynamically loading ${format} encoder...`);

        await ensureWasmLoaded(formatToType(format));

        availableEncoders[format] = true;
        encoderStates[format] = 'available';
        console.log(`${format} encoder loaded successfully`);
        return true;
    } catch (e) {
        encoderStates[format] = 'failed';
        console.error(`Failed to load ${format} encoder:`, e);
        return false;
    }
}

// Define CompressionResult interface based on the return type of compressImage
interface CompressionResult {
    data: Blob;
    size: number;
    compressionRatio: number;
    mimeType: string;
}

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

export function imageDataToUint8Array(imageData: ImageData): Uint8Array {
    return new Uint8Array(imageData.data.buffer);
}

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

export async function compressImage(
    file: File,
    format: OutputFormat,
    quality: number
): Promise<CompressionResult> {
    try {
        const encoderAvailable = await ensureEncoderLoaded(format);

        if (!encoderAvailable) {
            let fallbackFormat: OutputFormat | null = null;

            for (const potentialFallback of ['JPEG', 'PNG', 'WEBP'] as OutputFormat[]) {
                if (potentialFallback !== format) {
                    if (await ensureEncoderLoaded(potentialFallback)) {
                        fallbackFormat = potentialFallback;
                        break;
                    }
                }
            }

            if (!fallbackFormat) {
                throw new Error(`Format ${format} is not available and no fallback formats could be loaded`);
            }

            console.warn(`Format ${format} is not available. Falling back to ${fallbackFormat}`);
            format = fallbackFormat;
        }

        const imageData = await fileToImageData(file);
        let compressedData: Blob;
        const mimeType = getMimeType(format);

        switch (format) {
            case 'AVIF':
                const avifOptions: AvifEncodeOptions = { quality: quality / 100 };
                const avifBuffer = await avifEnc.encode(imageData, avifOptions);
                compressedData = new Blob([avifBuffer], { type: 'image/avif' });
                break;
            case 'JPEG':
                const jpegOptions: JpegEncodeOptions = { quality };
                const jpegBuffer = await jpegEnc.encode(imageData, jpegOptions);
                compressedData = new Blob([jpegBuffer], { type: 'image/jpeg' });
                break;
            case 'JXL':
                const jxlOptions: JxlEncodeOptions = { quality: quality / 100 };
                const jxlBuffer = await jxl.encode(imageData, jxlOptions);
                compressedData = new Blob([jxlBuffer], { type: 'image/jxl' });
                break;
            case 'PNG':
                const pngBuffer = await pngEnc.encode(imageData);
                compressedData = new Blob([pngBuffer], { type: 'image/png' });
                break;
            case 'WEBP':
                const webpOptions: WebpEncodeOptions = { quality };
                const webpBuffer = await webpEnc.encode(imageData, webpOptions);
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

        if (error instanceof Error) {
            const errorMessage = error.message.toLowerCase();
            if (errorMessage.includes('webassembly') ||
                errorMessage.includes('aborted') ||
                errorMessage.includes('wasm')) {
                availableEncoders[format] = false;

                throw new Error(
                    `Failed to load WebAssembly modules for ${format} compression. ` +
                    `This could be due to missing WASM files or network issues. ` +
                    `Check your browser's network tab for 404 errors related to .wasm files.`
                );
            }
        }

        throw error;
    }
}

export function calculateCompressionRatio(originalSize: number, compressedSize: number): number {
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

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
