# geometrize-cli

Command line interface for [geometrizejs](https://github.com/cancerberoSgx/geometrizejs). 

## Install

```sg
npm install -g geometrize 
```

## Usage

```sh
geometrize --input test/assets/panda.png --noOptimize --format svg --output tmp/1 --shapeTypes triangle,rectangle --iterations 100
```

## Options

 * `--input: string`: Path of file to convert. Also could be a glob pattern.
 * `--output?: string`: Folder for output files. If it doesn't exists it will be created. If none, output files will be written
in current folder.
 * `--outputFile?: string`: If [[input]] match a single file and this is defined the output file will be written in this location,creating folders if needed.
 * `--help?: boolean`:  Print usage information, then exit.
 * `--debug?: boolean`:  Prints debug messages.
 * `--image: Buffer`:
 * `--iterations?: number,`:
 * `--format?: 'svg' | 'json' | 'png' | 'jpg' | 'tiff' | 'gif' | 'bmp'`: Output format. Default: 'svg'
 * `--noOptimize?: boolean`: Don't optimize SVG.
 * `--shapeTypes: Array<ShapeTypes>;`: The types of shapes to use when generating the image.
 * `--alpha: number;`: The opacity of the shapes (0-255).
 * `--candidateShapesPerStep: number;`: The number of candidate shapes to try per model step.
 * `--shapeMutationsPerStep: number;`: The number of times to mutate each candidate shape.


## TODO
- [ ] users cannot use ImageRunner or Bitmap as types
- [x] document src/options.ts
- [x] options in readme
- [x] tests

## Related Projects

 * [](svg-png-converter)
