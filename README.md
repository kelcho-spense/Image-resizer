A modern, browser-based image compression tool that leverages WebAssembly for high-performance image optimization. Squish supports multiple formats and provides an intuitive interface for compressing your images without compromising quality.
![1741609398747](image/README/1741609398747.png)


## Features

* 🖼️ Support for multiple image formats:
  * AVIF (AV1 Image Format)
  * JPEG (using MozJPEG)
  * JPEG XL
  * PNG (using OxiPNG)
  * WebP
* 🚀 Key capabilities:
  * Browser-based compression (no server uploads needed)
  * Batch processing support
  * Format conversion
  * Quality adjustment per format
  * Real-time preview
  * Size reduction statistics
  * Drag and drop interface
  * Smart queue for compressing large number of files

## 🛠️ Technology

Squish is built with modern web technologies:

* React + TypeScript for the UI
* Vite for blazing fast development
* WebAssembly for native-speed image processing
* Tailwind CSS for styling
* jSquash for image codec implementations

## 🚀 Getting Started


## Usage

1. **Drop or Select Images** : Drag and drop images onto the upload area or click to select files
2. **Choose Output Format** : Select your desired output format (AVIF, JPEG, JPEG XL, PNG, or WebP)
3. **Adjust Quality** : Use the quality slider to balance between file size and image quality
4. **Download** : Download individual images or use the "Download All" button for batch downloads

## 🔧 Default Quality Settings

* AVIF: 50%
* JPEG: 75%
* JPEG XL: 75%
* PNG: Lossless
* WebP: 75%


## Acknowledgments

* [jSquash](https://github.com/jamsinclair/jSquash) for the WebAssembly image codecs
* [MozJPEG](https://github.com/mozilla/mozjpeg) for JPEG compression
* [libavif](https://github.com/AOMediaCodec/libavif) for AVIF support
* [libjxl](https://github.com/libjxl/libjxl) for JPEG XL support
* [Oxipng](https://github.com/shssoichiro/oxipng) for PNG optimization
