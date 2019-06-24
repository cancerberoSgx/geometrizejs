# geometrizejs

See the [playground](https://cancerberosgx.github.io/demos/geometrizejs-playground/) to understand what's this is all about.


 * [geometrize](https://www.geometrize.co.uk/) JavaScript API. Original idea is from [primitive](https://github.com/fogleman/primitive).
 * Generated directly from [official geometrize-haxe](https://github.com/Tw1ddle/geometrize-haxe) code.
 * For node.js and browsers.
 * TypeScript typings.
 * Zero dependencies.
 * No implementation, just typings for generated JavaScript library.
 * [Repository](https://github.com/cancerberoSgx/geometrizejs).
 * [playground](https://cancerberosgx.github.io/demos/geometrizejs-playground/).

## Usage

```
npm install --save geometrizejs
```

This example uses [jimp](TODO) to load images which supports formats both in node.js and browsers. Nevertheless any library can be used, such as [pngjs](TODO).

```js

import Jimp from 'jimp'
import { Bitmap, ImageRunner, ShapeTypes, SvgExporter } from 'geometrizejs'

(async () => {  

  // load png/jpeg/gif,bmp/tiff image from url, file path or Buffer using jimp:
  const image = await Jimp.read('test/assets/logo.png')
  const bitmap = Bitmap.createFromByteArray(image.bitmap.width, image.bitmap.height, image.bitmap.data)
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

## API docs

TODO

## Build geometrize.js

```sh
git clone --recurse-submodules https://github.com/cancerberoSgx/geometrizejs.git
cd geometrizejs
sh generate-geometrize-js.sh
```

That should re-generate `geometrizejs/src/geometrize.js`.

## TODO / Roadmap

- [ ] sourcemaps https://haxe.org/manual/debugging-source-map.html
- [ ] browser tests
- [ ] bitmap output tests
- [ ] JSON output tests
- [ ] performance tests. use different options and input image sizes and generate timings and output image diffs (as numbers - for example using imagemagick) - so we can better understand how options/image size/output quality relationships are. See https://github.com/Tw1ddle/geometrize-haxe-web/issues/3#issuecomment-504424092

## Extras / ideas 

The following are features not supported by haxe implementation. If implemented it will be in a separate project so this project keeps being zero-implementation:

- [ ] high level API to export current models to svg, png/jpg, json (so users dont have to build bitmap and iterate manually)
- [ ]
- [ ] notify listeners between N iterations passing current models  (format agnostic) (so they can take interval screenshots)
- [ ] Be able to change options while the iteration is still running
- [ ] be able to change iterations value ( while is running)
- [ ] Be able to pause an iteration and serialize its state (options and model, current iteration, iterations value) so later, in another process, we can load it and resume it (even increase iterations value)