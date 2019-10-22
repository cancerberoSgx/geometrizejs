# geometrizejs-extra

Extra (High level APIs) for [geometrizejs](https://github.com/cancerberoSgx/geometrizejs).

<!-- toc -->

- [Features](#features)
- [Install](#install)
- [Usage](#usage)
- [Options](#options)
- [Related Projects](#related-projects)
- [TODO](#todo)

<!-- tocstop -->

## Features

 * JPG, PNG, TIFF, GIF, BMP input formats
 * SVG, JSON, JPEG, PNG output formats
 * optimized SVG ouptut
 * ImageRunner steps iteration implementation
 * API to control the steps iteration  

## Install

```sg
npm install geometrizejs-extra 
```

## Usage
```js
import {Geometrize} from 'geometrizejs-extra'
const job = new Geometrize({
  input: 'test/assets/bluebells.jpg',
  output: 'tmp/formUrl.svg',
  shapeTypes: [ShapeTypes.TRIANGLE],
  iterations: 1000,
  onFinish: result => {
    
  },
  onStep: step => {
    
  }
})
const r = await job.start()
```
## Options


## Related Projects

 * [geometrizejs](https://www.npmjs.com/package/geometrizejs) (the library in which this tool is based)
 * [geometrize-haxe](https://github.com/Tw1ddle/geometrize-haxe/) (the original library from which geometrizejs is built from)
 * [geometrizejs-cli](https://www.npmjs.com/package/geometrizejs-cli) (provides CLI using this library)
 * [magica](https://www.npmjs.com/package/magica)
 * [mujer](https://www.npmjs.com/package/mujer) provides SVG optimization tools
 
## TODO

- [ ] magica to more formats ? 
- [ ] bitmap output - currently we raster the svg and we should be transforming the generated shape¡s image data.
- [ ] verify input from url
- [ ] document src/options.ts
- [ ] options in readme
- [ ] verify bitmap-regions works
- [x] browser tests
- [x] readme TOC
- [x] node.js tests
- [x] svg optimizer
- [x] use svg-to-png-converter to render bitmap formats
- [x] notify listeners between N iterations passing current models  (format agnostic) (so they can take interval screenshots)

## Toys

- [ ] a toy that randomly choose regions and options. defines new dimention for iteration, region-iteration and iterations inside of it. In the first one we don't apply algorithm just do it.
- [ ] tool that progressively animates svg shapes form one frame wo another a(and create new ones) to simulate primitive to realism.
- [ ] magica as a toy to build gif anims
  - [ ] use it to animate series
  - [ ] use it to animate progress in between nth steps
-  experiment self-drawing. what if from blank, we draw 5 primitives, then stop and use that as an input and draw some more, etc etc.
  - [ ] similar to previous, but at some points, put back the original image with modifications on top or blended so the algorithm still have a direction.
  - [ ] in general investigate what the result of building more than 1 model in parallel to compare ot be more artistic the second one could consume its own output, consume an image with an effect, etc.
  - [ ] similar - two models, one working with image effect (charcoal or paint style) and then how can they be blend

## ideas

- [ ] configuration to limit the size/length of shapes (i want them to be small)
- [ ] configuration for mutation magic numbers.
- [ ] research if svg simplify and smooth could work?
- [ ] serialize iteration state: I should be able to save current iteration on an image (json?) and later load it and continue (preserving score and internals)
- HTML API to optimally update a svg document on each step
- example of using canvas to render steps ?

- [ ] Research SVG post processing
  - [ ] SVG paths can be transformed with "simplify" (sharpen  by reducing nodes) and with smothing (adds nodes and transform ) 


## Ideas for geometrize-haxe core library

- [ ] extensibilty: geometrize should allow users to:
  - [ ] add new shapes types
  - [ ] pre / post process shape mutations and rasterize
- [ ] text shape - equivalent to rotated rectangle ? User can provide list of words or single letters. - configure font style - letter vs word vs paragraph.
    - [ ] for bitmap support we could, before processing 1) have the words/letters in svg 2) rasterize to bitmap 3) load as jimp/magica and transform(translate/rotate) using these to comply with rotated_rectangle and mask colors too.


## Complex / not important: 
- [ ] refined styles:
  - [ ] brushes / textures ? https://github.com/Tw1ddle/geometrize-haxe/issues/9
  - [ ] gradients ?
  - [ ] borders
