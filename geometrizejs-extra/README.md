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
- [ ] input from url
- [ ] document src/options.ts
- [ ] options in readme
- [x] browser tests
- [x] readme TOC
- [x] node.js tests
- [x] svg optimizer
- [x] use svg-to-png-converter to render bitmap formats