# geometrizejs

[Repository](https://github.com/cancerberoSgx/univac/tree/master/geometrizejs).

 * [geometrize](https://www.geometrize.co.uk/) JavaScript API.
 * Generated directly from [official geometrize-haxe](https://github.com/Tw1ddle/geometrize-haxe) code.
 * for node.js and browsers.
 * TypeScript typings
 * Zero dependencies.
 * No implementation, just typings for generated JavaScript library.

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

## Build gemoetrize.js

```sh
git clone --recurse-submodules https://github.com/cancerberoSgx/geometrizejs.git
cd geometrizejs
sh generate-geometrize-js.sh
```

That should replace `geometrizejs/src/geometrize.js`.