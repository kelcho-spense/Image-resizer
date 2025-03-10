import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import type { ImageFile } from '../types';

export function downloadImage(image: ImageFile) {
    if (!image.blob) return;

    const fileName = image.file.name.split('.')[0];
    const extension = image.outputType;
    saveAs(image.blob, `${fileName}.${extension}`);
}

export async function downloadAllImages(images: ImageFile[]) {
    const processedImages = images.filter(img => img.status === 'complete' && img.blob);

    if (processedImages.length === 0) return;

    // If only one image, download it directly
    if (processedImages.length === 1) {
        downloadImage(processedImages[0]);
        return;
    }

    // Create a zip file for multiple images
    const zip = new JSZip();

    processedImages.forEach(image => {
        if (!image.blob) return;

        const fileName = image.file.name.split('.')[0];
        const extension = image.outputType;
        zip.file(`${fileName}.${extension}`, image.blob);
    });

    // Generate and download the zip file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'compressed_images.zip');
}
