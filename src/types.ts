export type OutputType = 'avif' | 'jpeg' | 'jxl' | 'png' | 'webp';

export type ImageStatus = 'pending' | 'queued' | 'processing' | 'complete' | 'error';

export interface ImageFile {
    id: string;
    file: File;
    originalSize: number;
    preview?: string;
    status: ImageStatus;
    blob?: Blob;
    compressedSize?: number;
    outputType?: OutputType;
    error?: string;
}

export interface CompressionOptions {
    quality: number;
}
