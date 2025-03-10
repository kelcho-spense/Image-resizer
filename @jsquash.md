# @jsquash/avif

[](https://www.npmjs.com/package/@jsquash/avif#jsquashavif)

[![npm version](https://camo.githubusercontent.com/736a90b5db96119911b817adf6eb95c85909763bfa3fcf34aab4969b73c67b1e/68747470733a2f2f62616467652e667572792e696f2f6a732f406a737175617368253246617669662e737667)](https://badge.fury.io/js/@jsquash%2Favif)

An easy experience for encoding and decoding AVIF images in the browser. Powered by WebAssembly ⚡️.

Uses the [libavif](https://github.com/AOMediaCodec/libavif) library.

A [jSquash](https://github.com/jamsinclair/jSquash) package. Codecs and supporting code derived from the [Squoosh](https://github.com/GoogleChromeLabs/squoosh) app.

## Installation

[](https://www.npmjs.com/package/@jsquash/avif#installation)

```shell
npm install --save @jsquash/avif
# Or your favourite package manager alternative
```

## Usage

[](https://www.npmjs.com/package/@jsquash/avif#usage)

Note: You will need to either manually include the wasm files from the codec directory or use a bundler like WebPack or Rollup to include them in your app/server.

### decode(data: ArrayBuffer): Promise

[](https://www.npmjs.com/package/@jsquash/avif#decodedata-arraybuffer-promise)

Decodes AVIF binary ArrayBuffer to raw RGB image data.

#### data

[](https://www.npmjs.com/package/@jsquash/avif#data)

Type: `ArrayBuffer`

#### Example

[](https://www.npmjs.com/package/@jsquash/avif#example)

```js
import { decode } from '@jsquash/avif';

const formEl = document.querySelector('form');
const formData = new FormData(formEl);
// Assuming user selected an input avif file
const imageData = await decode(await formData.get('image').arrayBuffer());
```

### encode(data: ImageData, options?: EncodeOptions): Promise

[](https://www.npmjs.com/package/@jsquash/avif#encodedata-imagedata-options-encodeoptions-promise)

Encodes raw RGB image data to AVIF format and resolves to an ArrayBuffer of binary data.

#### data

[](https://www.npmjs.com/package/@jsquash/avif#data-1)

Type: `ImageData`

#### options

[](https://www.npmjs.com/package/@jsquash/avif#options)

Type: `Partial<EncodeOptions>`

The AVIF encoder options for the output image. [See default values](https://github.com/jamsinclair/jSquash/blob/HEAD/meta.ts).

#### Example

[](https://www.npmjs.com/package/@jsquash/avif#example-1)

```js
import { encode } from '@jsquash/avif';

async function loadImage(src) {
  const img = document.createElement('img');
  img.src = src;
  await new Promise(resolve => img.onload = resolve);
  const canvas = document.createElement('canvas');
  [canvas.width, canvas.height] = [img.width, img.height];
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}

const rawImageData = await loadImage('/example.png');
const avifBuffer = await encode(rawImageData);
```

## Manual WASM initialisation (not recommended)

[](https://www.npmjs.com/package/@jsquash/avif#manual-wasm-initialisation-not-recommended)

In most situations there is no need to manually initialise the provided WebAssembly modules. The generated glue code takes care of this and supports most web bundlers.

One situation where this arises is when using the modules in Cloudflare Workers ([See the README for more info](https://github.com/jamsinclair/jSquash/blob/HEAD/README.md#usage-in-cloudflare-workers)).

The `encode` and `decode` modules both export an `init` function that can be used to manually load the wasm module.

```js
import decode, { init as initAvifDecode } from '@jsquash/avif/decode';

initAvifDecode(WASM_MODULE); // The `WASM_MODULE` variable will need to be sourced by yourself and passed as an ArrayBuffer.
const image = await fetch('./image.avif').then(res => res.arrayBuffer()).then(decode);
```

You can also pass custom options to the `init` function to customise the behaviour of the module. See the [Emscripten documentation](https://emscripten.org/docs/api_reference/module.html#Module) for more information.

```js
import decode, { init as initAvifDecode } from '@jsquash/avif/decode';

initAvifDecode(null, {
  // Customise the path to load the wasm file
  locateFile: (path, prefix) => `https://example.com/${prefix}/${path}`,
});
const image = await fetch('./image.avif').then(res => res.arrayBuffer()).then(decode);
```

# @jsquash/jpeg

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jpeg#jsquashjpeg)

[![npm version](https://camo.githubusercontent.com/8df008a54835d672db869e9819bec02c622b7a3f8e608aa27f020a1e9e8981ea/68747470733a2f2f62616467652e667572792e696f2f6a732f406a7371756173682532466a7065672e737667)](https://badge.fury.io/js/@jsquash%2Fjpeg)

An easy experience for encoding and decoding JPEG images in the browser. Powered by WebAssembly ⚡️.

Uses the [MozJPEG](https://github.com/mozilla/mozjpeg) library.

A [jSquash](https://github.com/jamsinclair/jSquash) package. Codecs and supporting code derived from the [Squoosh](https://github.com/GoogleChromeLabs/squoosh) app.

## Installation

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jpeg#installation)

```shell
npm install --save @jsquash/jpeg
# Or your favourite package manager alternative
```

## Usage

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jpeg#usage)

Note: You will need to either manually include the wasm files from the codec directory or use a bundler like WebPack or Rollup to include them in your app/server.

### decode(data: ArrayBuffer): Promise

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jpeg#decodedata-arraybuffer-promise)

Decodes JPEG binary ArrayBuffer to raw RGB image data.

#### data

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jpeg#data)

Type: `ArrayBuffer`

#### Example

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jpeg#example)

```js
import { decode } from '@jsquash/jpeg';

const formEl = document.querySelector('form');
const formData = new FormData(formEl);
// Assuming user selected an input jpeg file
const imageData = await decode(await formData.get('image').arrayBuffer());
```

### encode(data: ImageData, options?: EncodeOptions): Promise

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jpeg#encodedata-imagedata-options-encodeoptions-promise)

Encodes raw RGB image data to JPEG format and resolves to an ArrayBuffer of binary data.

#### data

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jpeg#data-1)

Type: `ImageData`

#### options

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jpeg#options)

Type: `Partial<EncodeOptions>`

The MozJPEG encoder options for the output image. [See default values](https://github.com/jamsinclair/jSquash/blob/main/packages/jpeg/meta.ts).

#### Example

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jpeg#example-1)

```js
import { encode } from '@jsquash/jpeg';

async function loadImage(src) {
  const img = document.createElement('img');
  img.src = src;
  await new Promise(resolve => img.onload = resolve);
  const canvas = document.createElement('canvas');
  [canvas.width, canvas.height] = [img.width, img.height];
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}

const rawImageData = await loadImage('/example.png');
const jpegBuffer = await encode(rawImageData);
```

## Manual WASM initialisation (not recommended)

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jpeg#manual-wasm-initialisation-not-recommended)

In most situations there is no need to manually initialise the provided WebAssembly modules. The generated glue code takes care of this and supports most web bundlers.

One situation where this arises is when using the modules in Cloudflare Workers ([See the README for more info](https://github.com/jamsinclair/jSquash/blob/main/README.md#usage-in-cloudflare-workers)).

The `encode` and `decode` modules both export an `init` function that can be used to manually load the wasm module.

```js
import decode, { init as initJpegDecode } from '@jsquash/jpeg/decode';

initJpegDecode(WASM_MODULE); // The `WASM_MODULE` variable will need to be sourced by yourself and passed as an ArrayBuffer.
const image = await fetch('./image.jpeg').then(res => res.arrayBuffer()).then(decode);
```

You can also pass custom options to the `init` function to customise the behaviour of the module. See the [Emscripten documentation](https://emscripten.org/docs/api_reference/module.html#Module) for more information.

```js
import decode, { init as initJpegDecode } from '@jsquash/jpeg/decode';

initJpegDecode(null, {
  // Customise the path to load the wasm file
  locateFile: (path, prefix) => `https://example.com/${prefix}/${path}`,
});
const image = await fetch('./image.jpeg').then(res => res.arrayBuffer()).then(decode);
```


# @jsquash/jxl

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jxl#jsquashjxl)

[![npm version](https://camo.githubusercontent.com/4fe875972907116494222e328df44500541e9aed280c3d2bcf02ec77589704e1/68747470733a2f2f62616467652e667572792e696f2f6a732f406a7371756173682532466a786c2e737667)](https://badge.fury.io/js/@jsquash%2Fjxl)

An easy experience for encoding and decoding JPEG XL images in the browser. Powered by WebAssembly ⚡️.

⚠️ Only one stable browser supports displaying JPEG XL [so far](https://caniuse.com/jpegxl). This package is intended for experimentation and testing.

Uses the [libjxl](https://github.com/libjxl/libjxl) library.

A [jSquash](https://github.com/jamsinclair/jSquash) package. Codecs and supporting code derived from the [Squoosh](https://github.com/GoogleChromeLabs/squoosh) app.

## Installation

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jxl#installation)

```shell
npm install --save @jsquash/jxl
# Or your favourite package manager alternative
```

## Usage

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jxl#usage)

Note: You will need to either manually include the wasm files from the codec directory or use a bundler like WebPack or Rollup to include them in your app/server.

### decode(data: ArrayBuffer): Promise

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jxl#decodedata-arraybuffer-promise)

Decodes JPEG XL binary ArrayBuffer to raw RGB image data.

#### data

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jxl#data)

Type: `ArrayBuffer`

#### Example

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jxl#example)

```js
import { decode } from '@jsquash/jxl';

const formEl = document.querySelector('form');
const formData = new FormData(formEl);
// Assuming user selected an input JPEG XL file
const imageData = await decode(await formData.get('image').arrayBuffer());
```

### encode(data: ImageData, options?: EncodeOptions): Promise

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jxl#encodedata-imagedata-options-encodeoptions-promise)

Encodes raw RGB image data to JPEG format and resolves to an ArrayBuffer of binary data.

#### data

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jxl#data-1)

Type: `ImageData`

#### options

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jxl#options)

Type: `Partial<EncodeOptions>`

The JPEG XL encoder options for the output image. [See default values](https://github.com/jamsinclair/jSquash/blob/main/packages/jxl/meta.ts).

#### Example

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jxl#example-1)

```js
import { encode } from '@jsquash/jxl';

async function loadImage(src) {
  const img = document.createElement('img');
  img.src = src;
  await new Promise(resolve => img.onload = resolve);
  const canvas = document.createElement('canvas');
  [canvas.width, canvas.height] = [img.width, img.height];
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}

const rawImageData = await loadImage('/example.png');
const jpegBuffer = await encode(rawImageData);
```

## Manual WASM initialisation (not recommended)

[](https://github.com/jamsinclair/jSquash/tree/main/packages/jxl#manual-wasm-initialisation-not-recommended)

In most situations there is no need to manually initialise the provided WebAssembly modules. The generated glue code takes care of this and supports most web bundlers.

One situation where this arises is when using the modules in Cloudflare Workers ([See the README for more info](https://github.com/jamsinclair/jSquash/blob/main/README.md#usage-in-cloudflare-workers)).

The `encode` and `decode` modules both export an `init` function that can be used to manually load the wasm module.

```js
import decode, { init as initJXLDecode } from '@jsquash/jxl/decode';

initJXLDecode(WASM_MODULE); // The `WASM_MODULE` variable will need to be sourced by yourself and passed as an ArrayBuffer.
const image = await fetch('./image.jpeg').then(res => res.arrayBuffer()).then(decode);
```

You can also pass custom options to the `init` function to customise the behaviour of the module. See the [Emscripten documentation](https://emscripten.org/docs/api_reference/module.html#Module) for more information.

```js
import decode, { init as initJXLDecode } from '@jsquash/jxl/decode';

initJXLDecode(null, {
  // Customise the path to load the wasm file
  locateFile: (path, prefix) => `https://example.com/${prefix}/${path}`,
});
const image = await fetch('./image.jxl').then(res => res.arrayBuffer()).then(decode);
```


# @jsquash/png

[](https://github.com/jamsinclair/jSquash/tree/main/packages/png#jsquashpng)

[![npm version](https://camo.githubusercontent.com/5d4f21984a8477d3d961073d1f73f21e83f353417dd1089e6c671fc1c7b15d1c/68747470733a2f2f62616467652e667572792e696f2f6a732f406a737175617368253246706e672e737667)](https://badge.fury.io/js/@jsquash%2Fpng)

An easy experience for encoding and decoding PNG images in the browser. Powered by WebAssembly ⚡️.

Uses the [rust PNG crate](https://docs.rs/png/0.11.0/png/).

A [jSquash](https://github.com/jamsinclair/jSquash) package. Codecs and supporting code derived from the [Squoosh](https://github.com/GoogleChromeLabs/squoosh) app.

## Installation

[](https://github.com/jamsinclair/jSquash/tree/main/packages/png#installation)

```shell
npm install --save @jsquash/png
# Or your favourite package manager alternative
```

## Usage

[](https://github.com/jamsinclair/jSquash/tree/main/packages/png#usage)

Note: You will need to either manually include the wasm files from the codec directory or use a bundler like WebPack or Rollup to include them in your app/server.

### decode(data: ArrayBuffer): Promise

[](https://github.com/jamsinclair/jSquash/tree/main/packages/png#decodedata-arraybuffer-promise)

Decodes PNG binary ArrayBuffer to raw RGB image data.

#### data

[](https://github.com/jamsinclair/jSquash/tree/main/packages/png#data)

Type: `ArrayBuffer`

#### Example

[](https://github.com/jamsinclair/jSquash/tree/main/packages/png#example)

```js
import { decode } from '@jsquash/png';

const formEl = document.querySelector('form');
const formData = new FormData(formEl);
const imageData = await decode(await formData.get('image').arrayBuffer());
```

### encode(data: ImageData): Promise

[](https://github.com/jamsinclair/jSquash/tree/main/packages/png#encodedata-imagedata-promise)

> ℹ️ You may want to use the [@jsquash/oxipng](https://github.com/jamsinclair/jSquash/blob/main/packages/oxipng) package instead. It can both optimise and encode to PNG directly from raw image data.

Encodes raw RGB image data to PNG format and resolves to an ArrayBuffer of binary data.

#### data

[](https://github.com/jamsinclair/jSquash/tree/main/packages/png#data-1)

Type: `ImageData`

#### Example

[](https://github.com/jamsinclair/jSquash/tree/main/packages/png#example-1)

```js
import { encode } from '@jsquash/png';

async function loadImage(src) {
  const img = document.createElement('img');
  img.src = src;
  await new Promise(resolve => img.onload = resolve);
  const canvas = document.createElement('canvas');
  [canvas.width, canvas.height] = [img.width, img.height];
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}

const rawImageData = await loadImage('/example.jpg');
const pngBuffer = await encode(rawImageData);
```

## Manual WASM initialisation (not recommended)

[](https://github.com/jamsinclair/jSquash/tree/main/packages/png#manual-wasm-initialisation-not-recommended)

In most situations there is no need to manually initialise the provided WebAssembly modules. The generated glue code takes care of this and supports most web bundlers.

One situation where this arises is when using the modules in Cloudflare Workers ([See the README for more info](https://github.com/jamsinclair/jSquash/blob/main/README.md#usage-in-cloudflare-workers)).

The `encode` and `decode` modules both export an `init` function that can be used to manually load the wasm module.

```js
import decode, { init as initPngDecode } from '@jsquash/png/decode';

initPngDecode(WASM_MODULE); // The `WASM_MODULE` variable will need to be sourced by yourself and passed as an ArrayBuffer.
const image = await fetch('./image.png').then(res => res.arrayBuffer()).then(decode);
```


# @jsquash/resize

[](https://github.com/jamsinclair/jSquash/tree/main/packages/resize#jsquashresize)

[![npm version](https://camo.githubusercontent.com/8004d0978e65ca51d4187f211c839b83a04fb2e1581ab6dced58c309052a677f/68747470733a2f2f62616467652e667572792e696f2f6a732f406a737175617368253246726573697a652e737667)](https://badge.fury.io/js/@jsquash%2Fresize)

An easy experience for resizing images in the browser or V8 environment. Powered by WebAssembly ⚡️ and Rust.

ℹ️ You will need to have an already decoded ImageData object to resize. This can be accomplished by using other jSquash modules or using the Canvas API, if available.

Uses squoosh's [Resize module](https://github.com/GoogleChromeLabs/squoosh/blob/dev/src/features/processors/resize/worker/resize.ts). Composed of:

* [https://github.com/PistonDevelopers/resize](https://github.com/PistonDevelopers/resize)
* [https://github.com/CryZe/wasmboy-rs/tree/master/hqx](https://github.com/CryZe/wasmboy-rs/tree/master/hqx)

Addtionally we have added support for the Magic Kernel algorithm for resizing images. This is a Rust implementation of the algorithm.

* [https://github.com/SevInf/magic-kernel-rust](https://github.com/SevInf/magic-kernel-rust)

A [jSquash](https://github.com/jamsinclair/jSquash) package. Codecs and supporting code derived from the [Squoosh](https://github.com/GoogleChromeLabs/squoosh) app.

## Installation

[](https://github.com/jamsinclair/jSquash/tree/main/packages/resize#installation)

```shell
npm install --save @jsquash/resize
# Or your favourite package manager alternative
```

## Usage

[](https://github.com/jamsinclair/jSquash/tree/main/packages/resize#usage)

Note: You will need to either manually include the wasm files from the codec directory or use a bundler like WebPack or Rollup to include them in your app/server.

### resize(data: ImageData, options: ResizeOptions): Promise

[](https://github.com/jamsinclair/jSquash/tree/main/packages/resize#resizedata-imagedata-options-resizeoptions-promise)

Resizes an ImageData object to the specified dimensions.

#### data

[](https://github.com/jamsinclair/jSquash/tree/main/packages/resize#data)

Type: `ImageData`

#### options

[](https://github.com/jamsinclair/jSquash/tree/main/packages/resize#options)

Type: `Partial<ResizeOptions> & { width: number, height: number }`

The resize options for the output image. [See default values](https://github.com/jamsinclair/jSquash/blob/main/packages/resize/meta.ts).

* `width` (number) the width to resize the image to
* `height` (number) the height to resize the image to
* `method?` (`'triangle'` | `'catrom'` | `'mitchell'` | `'lanczos3'` | `'hqx'` | `'magicKernel'` | `'magicKernelSharp2013'` | `'magicKernelSharp2021'`) the algorithm used to resize the image. Defaults to `lanczos3`.
* `fitMethod?` (`'stretch'` | `'contain'`) whether the image is stretched to fit the dimensions or cropped. Defaults to `stretch`.
* `premultiply?` (boolean) Defaults to `true`
* `linearRGB?` (boolean) Defaults to `true`

#### Example

[](https://github.com/jamsinclair/jSquash/tree/main/packages/resize#example)

```js
import { decode } from '@jsquash/jpeg';
import resize from '@jsquash/resize';

const imageBuffer = fetch('/images/example.jpg').then(res => res.arrayBuffer());
const originalImageData = await decode(imageBuffer);
const resizedImageData = await resize(originalImageData, { height: 300, width: 400 };
```

## Manual WASM initialisation (not recommended)

[](https://github.com/jamsinclair/jSquash/tree/main/packages/resize#manual-wasm-initialisation-not-recommended)

In most situations there is no need to manually initialise the provided WebAssembly modules. The generated glue code takes care of this and supports most web bundlers.

One situation where this arises is when using the modules in Cloudflare Workers ([See the README for more info](https://github.com/jamsinclair/jSquash/blob/main/README.md#usage-in-cloudflare-workers)).

The main module exports `initHqx` and `initResize` functions that can be used to manually load their respective wasm module.

```js
import resize, { initResize } from '@jsquash/resize';

initResize(WASM_MODULE); // The `WASM_MODULE` variable will need to be sourced by yourself and passed as an ArrayBuffer.

resize(image, options);

// Optionally if you know you are using the hqx method or magicKernel method you can also initialise those modules
import { initHqx, initMagicKernel } from '@jsquash/resize';

initHqx(HQX_WASM_MODULE);
initMagicKernel(MAGIC_KERNEL_WASM_MODULE);
```


# @jsquash/webp

[](https://github.com/jamsinclair/jSquash/tree/main/packages/webp#jsquashwebp)

[![npm version](https://camo.githubusercontent.com/d78a93cca052496dadee12bd703af614d769e49f5f31d4a351027784193d3fe5/68747470733a2f2f62616467652e667572792e696f2f6a732f406a737175617368253246776562702e737667)](https://badge.fury.io/js/@jsquash%2Fwebp)

An easy experience for encoding and decoding WebP images in the browser. Powered by WebAssembly ⚡️.

Uses the [libwebp](https://github.com/webmproject/libwebp) library.

A [jSquash](https://github.com/jamsinclair/jSquash) package. Codecs and supporting code derived from the [Squoosh](https://github.com/GoogleChromeLabs/squoosh) app.

## Installation

[](https://github.com/jamsinclair/jSquash/tree/main/packages/webp#installation)

```shell
npm install --save @jsquash/webp
# Or your favourite package manager alternative
```

## Usage

[](https://github.com/jamsinclair/jSquash/tree/main/packages/webp#usage)

Note: You will need to either manually include the wasm files from the codec directory or use a bundler like WebPack or Rollup to include them in your app/server.

### decode(data: ArrayBuffer): Promise

[](https://github.com/jamsinclair/jSquash/tree/main/packages/webp#decodedata-arraybuffer-promise)

Decodes WebP binary ArrayBuffer to raw RGB image data.

#### data

[](https://github.com/jamsinclair/jSquash/tree/main/packages/webp#data)

Type: `ArrayBuffer`

#### Example

[](https://github.com/jamsinclair/jSquash/tree/main/packages/webp#example)

```js
import { decode } from '@jsquash/webp';

const formEl = document.querySelector('form');
const formData = new FormData(formEl);
// Assuming user selected an input WebP file
const imageData = await decode(await formData.get('image').arrayBuffer());
```

### encode(data: ImageData, options?: EncodeOptions): Promise

[](https://github.com/jamsinclair/jSquash/tree/main/packages/webp#encodedata-imagedata-options-encodeoptions-promise)

Encodes raw RGB image data to WebP format and resolves to an ArrayBuffer of binary data.

#### data

[](https://github.com/jamsinclair/jSquash/tree/main/packages/webp#data-1)

Type: `ImageData`

#### options

[](https://github.com/jamsinclair/jSquash/tree/main/packages/webp#options)

Type: `Partial<EncodeOptions>`

The WebP encoder options for the output image. [See default values](https://github.com/jamsinclair/jSquash/blob/main/packages/webp/meta.ts).

#### Example

[](https://github.com/jamsinclair/jSquash/tree/main/packages/webp#example-1)

```js
import { encode } from '@jsquash/webp';

async function loadImage(src) {
  const img = document.createElement('img');
  img.src = src;
  await new Promise(resolve => img.onload = resolve);
  const canvas = document.createElement('canvas');
  [canvas.width, canvas.height] = [img.width, img.height];
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}

const rawImageData = await loadImage('/example.png');
const webpBuffer = await encode(rawImageData);
```

## Manual WASM initialisation (not recommended)

[](https://github.com/jamsinclair/jSquash/tree/main/packages/webp#manual-wasm-initialisation-not-recommended)

In most situations there is no need to manually initialise the provided WebAssembly modules. The generated glue code takes care of this and supports most web bundlers.

One situation where this arises is when using the modules in Cloudflare Workers ([See the README for more info](https://github.com/jamsinclair/jSquash/blob/main/README.md#usage-in-cloudflare-workers)).

The `encode` and `decode` modules both export an `init` function that can be used to manually load the wasm module.

```js
import decode, { init as initWebpDecode } from '@jsquash/webp/decode';

initWebpDecode(WASM_MODULE); // The `WASM_MODULE` variable will need to be sourced by yourself and passed as an ArrayBuffer.
const image = await fetch('./image.webp').then(res => res.arrayBuffer()).then(decode);
```

You can also pass custom options to the `init` function to customise the behaviour of the module. See the [Emscripten documentation](https://emscripten.org/docs/api_reference/module.html#Module) for more information.

```js
import decode, { init as initWebpDecode } from '@jsquash/webp/decode';

initWebpDecode(null, {
  // Customise the path to load the wasm file
  locateFile: (path, prefix) => `https://example.com/${prefix}/${path}`,
});
const image = await fetch('./image.webp').then(res => res.arrayBuffer()).then(decode);
```
