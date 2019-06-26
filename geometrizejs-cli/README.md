# geometrizejs-cli

Command line interface for [geometrizejs](https://github.com/cancerberoSgx/geometrizejs). 

## Install

```sg
npm install -g geometrizejs-cli 
```

## Usage

```sh
geometrize --input test/assets/panda.png --noOptimize --format svg --output tmp/1 --shapeTypes triangle,rectangle --iterations 100
```

## Options

 * `--input: string`: Path of file to convert. Also could be a glob pattern.
 * `--output?: string`:If input file is only one then the output file will be written at this path, if given. If multiple input files are given, then the output files will be written at this folder path. In both cases, folders will be created if they doesn't exists. If not given output files will be written in stdout.
 * `--outputFile?: string`: If [[input]] match a single file and this is defined, the output file will be written at this location, creating folders if needed.
 * `--help?: boolean`:  Print usage information, then exit.
 * `--debug?: boolean`:  Prints debug messages.
 * `--image: Buffer`:
 * `--iterations?: number,`:
 * `--format?: 'svg' | 'json' | 'png' | 'jpg' | 'tiff' | 'gif' | 'bmp'`: Output format. Default: 'svg'
 * `--noOptimize?: boolean`: Don't optimize SVG.
 * `--shapeTypes: Array<ShapeTypes>;`: The types of shapes to use when generating the image, as strings, any of: `RECTANGLE`, `ROTATED_RECTANGLE`, `TRIANGLE`, `ELLIPSE`, `ROTATED_ELLIPSE`, `CIRCLE`, `LINE`.
 * `--alpha: number;`: The opacity of the shapes (0-255).
 * `--candidateShapesPerStep: number;`: The number of candidate shapes to try per model step.
 * `--shapeMutationsPerStep: number;`: The number of times to mutate each candidate shape.

Important. --shapeTypes are accepted as strings, any of: `RECTANGLE`, `ROTATED_RECTANGLE`, `TRIANGLE`, `ELLIPSE`, `ROTATED_ELLIPSE`, `CIRCLE`, `LINE`.
    
## Related Projects

 * [geometrizejs](https://github.com/cancerberoSgx/geometrizejs)
 * [svg-png-converter](https://www.npmjs.com/package/svg-png-converter)
 * [magica](https://www.npmjs.com/package/magica)
 * [mujer](https://www.npmjs.com/package/mujer)
 
## TODO

- [ ] cli: use mujer for optimizing and remove this implementation
- [ ] use svg-to-png-converter to render bitmap formats
- [ ] users cannot use ImageRunner or Bitmap as types
- [x] document src/options.ts
- [x] options in readme
- [x] tests

