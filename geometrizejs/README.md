# geometrizejs

See the [playground](https://cancerberosgx.github.io/demos/geometrizejs-playground/) to understand what's this is all about.

## Contents

<!-- toc -->

- [Summary](#summary)
- [Usage](#usage)
  * [Render SVG](#render-svg)
  * [Render bitmap](#render-bitmap)
- [Render JSON](#render-json)
- [API docs](#api-docs)
- [Build geometrize.js](#build-geometrizejs)
- [TODO / Roadmap](#todo--roadmap)
- [Extras / ideas](#extras--ideas)
- [Complex / not important:](#complex--not-important)

<!-- tocstop -->

## Summary

 * [geometrize](https://www.geometrize.co.uk/) JavaScript API. Original idea is from [primitive](https://github.com/fogleman/primitive).
 * Generated directly from [official geometrize-haxe](https://github.com/Tw1ddle/geometrize-haxe) code.
 * For node.js and browsers.
 * TypeScript typings.
 * Zero dependencies.
 * No implementation, just typings for generated JavaScript library.
 * [Repository](https://github.com/cancerberoSgx/geometrizejs).
 * [playground](https://cancerberosgx.github.io/demos/geometrizejs-playground/).
 
## Usage

Note that this library is just types for [official geometrize-haxe](https://github.com/Tw1ddle/geometrize-haxe) so it doesn't support any image read/write and the API could seems low level. 

Checkout **[geometrizejs-extra](https://github.com/cancerberoSgx/geometrizejs/tree/master/geometrizejs-extra)** which provides an **easy to use** API and supports several image formats both in node and browser. 

```sh
npm install --save geometrizejs
```

This example uses [jimp](TODO) to load images which supports formats both in node.js and browsers. Nevertheless any library can be used, such as [pngjs](TODO).

## Examples

### Render SVG

```js
import Jimp from 'jimp'
import { Bitmap, ImageRunner, ShapeTypes, SvgExporter } from 'geometrizejs'

(async () => {
  // load png/jpeg/gif,bmp/tiff image from url, file path or Buffer using jimp:
  const image = await Jimp.read('test/assets/logo.png')
  const bitmap = Bitmap.createFromByteArray(image.bitmap.width, 
    image.bitmap.height, image.bitmap.data)
  const runner = new ImageRunner(bitmap)
  const options = {
    shapeTypes: [ShapeTypes.CIRCLE, ShapeTypes.TRIANGLE],
    candidateShapesPerStep: 50,
    shapeMutationsPerStep: 100,
    alpha: 128
  }
  const iterations = 500
  const svgData = []
  for (let i = 0; i < iterations; i++) {
    svgData.push(SvgExporter.exportShapes(runner.step(options)))
  }
  const svg = SvgExporter.getSvgPrelude() + 
    SvgExporter.getSvgNodeOpen(bitmap.width, bitmap.height) + 
    svgData.join('\n') + 
    SvgExporter.getSvgNodeClose()

  // in node.js:
  writeFileSync('output.svg', svg)

  // in the browser:
  document.getElementById('svg-container').innerHTML = svg
})()
```

### Render bitmap

```js
import Jimp from 'jimp'
import { Bitmap, ImageRunner, ShapeTypes } from 'geometrizejs'

(async () => {
  // load png/jpeg/gif,bmp/tiff image from url, file path or Buffer using jimp:
   const image = await Jimp.read('test/assets/logo.png')
  const bitmap = Bitmap.createFromByteArray(image.bitmap.width, 
    image.bitmap.height, image.bitmap.data)
  const runner = new ImageRunner(bitmap)
  const options = {
    shapeTypes: [ShapeTypes.TRIANGLE],
    candidateShapesPerStep: 50,
    shapeMutationsPerStep: 100,
    alpha: 128
  }
  const iterations = 2000
  for (let i = 0; i < iterations; i++) {
    const r = runner.step(options)
  }
  const bytes = runner.getImageData().getBytes().b
  const out = new Jimp({ 
    width: image.bitmap.width, 
    height: image.bitmap.height,
    data: bytes
  })
  // in node.js we could write it to file
  await out.writeAync('tmp/bitmap/logo.png')

  // in the browser we could write it to a <img> element as data url
  document.getElementById('target-image').src = await out.getBase64Async()
})()
```

## Render JSON

Getting the shapes as JSON can be used to render them using other technology or processing / analyse them:

```js
import Jimp from 'jimp'
import { Bitmap, ImageRunner, ShapeTypes } from 'geometrizejs'

(async () => {
  const image = await Jimp.read('test/assets/logo.png')
  const bitmap = Bitmap.createFromByteArray(image.bitmap.width, 
    image.bitmap.height, image.bitmap.data)
  const runner = new ImageRunner(bitmap)
  const options = {
    shapeTypes: [ShapeTypes.CIRCLE],
    candidateShapesPerStep: 50,
    shapeMutationsPerStep: 100,
    alpha: 128
  }
  const iterations = 200
  const shapes = []
  for (let i = 0;i < iterations;i++) {
    shapes.push(...JSON.parse(ShapeJsonExporter.exportShapes(runner.step(options))))
  }
  // shapes is an array of objects serializable with JSON.stringify() 
})()
```

## API docs

TODO

## Build geometrize.js

```sh
git clone --recurse-submodules https://github.com/cancerberoSgx/geometrizejs.git
cd geometrizejs
sh generate-geometrize-js.sh
```

That should re-generate `geometrizejs/src/geometrize.js`.


## ImageRunnerOptions

 * `shapeTypes: Array<ShapeTypes>`: The types of shapes to use when generating the image.
 * `alpha: number`: The opacity of the shapes (0-255).
 * `candidateShapesPerStep: number`: The number of candidate shapes to try per model step.
 * `shapeMutationsPerStep: number`: The number of times to mutate each candidate shape.

## TODO / Roadmap
- [ ] research wasm build using haxe
- [ ] browser tests
- [x] sourcemaps https://haxe.org/manual/debugging-source-map.html
- [x] bitmap output tests
- [x] JSON output tests
- [ ] performance tests. use different options and input image sizes and generate timings and output image diffs (as numbers - for example using imagemagick) - so we can better understand how options/image size/output quality relationships are. See https://github.com/Tw1ddle/geometrize-haxe-web/issues/3#issuecomment-504424092
- performance on haxe lib: 
  * explicit option to not copy buffers
  * https://stackoverflow.com/a/16679447/1179379 - seems transforming u8int to u32int array is faster to extract colors ? maybe even in haxe
  * use Uint8ClampedArray ? 
  
 
### Extras / ideas 

The following are features not supported by haxe implementation. If implemented it will be in a separate project so this project keeps being zero-implementation:

- [ ] high level API to export current models to svg, png/jpg, json (so users dont have to build bitmap and iterate manually)
- [ ] geometrize - a new shape "text" - equivalent to rotated rectangle ? User can provide list of words - configure font style - letter vs word vs paragraph
- [ ] notify listeners between N iterations passing current models  (format agnostic) (so they can take interval screenshots)
- [ ] Be able to change options while the iteration is still running
- [ ] be able to change iterations value ( while is running)
- [ ] Be able to pause an iteration and serialize its state (options and model, current iteration, iterations value) so later, in another process, we can load it and resume it (even increase iterations value)
- [ ] implement quadratic blezier curves based on https://github.com/Tw1ddle/geometrize-lib/blob/be14f7bf0d183faa03127c6500c6194877b3ee3d/geometrize/geometrize/rasterizer/rasterizer.cpp#L308 ? 
- [ ] Research SVG post processing
  - [ ] document that big SVGs can be reduced up to 50% size with svgo which supports node and browser (js)
  - [ ] SVG paths can be transformed with "simplify" (sharpen  by reducing nodes) and with smothing (adds nodes and transform ) 
  - document that bitmap images can be generated from svgs (and good quality) offline with other tools. 
- [ ] extensibilty: geometrize should allow users to:
  - [ ] add new shapes types
  - [ ] pre / post process shape mutations and rasterize

## Complex / not important: 
- [ ]refined styles:
  - [ ] brushes / textures ? https://github.com/Tw1ddle/geometrize-haxe/issues/9
  - [ ] gradients ?
  - [ ] borders
