# geometrizejs-cli

Command line interface for [geometrizejs](https://github.com/cancerberoSgx/geometrizejs). 

## Features

 * JPG, PNG, TIFF, GIF, BMP input formats
 * SVG, JSON, JPEG, PNG output formats
 * config json file
 * input file globs
 * <a href="https://cancerberosgx.github.io/demos/geometrizejs-cli/index.html">Easy series generation</a>)

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
 * `--help?: boolean`:  Print usage information, then exit.
 * `--debug?: boolean`:  Prints debug messages.
 * `--image: Buffer`:
 * `--iterations?: number,`:
 * `--format?: 'svg' | 'json' | 'png' | 'jpeg'`: Output format. Default: 'svg'
 * `--noOptimize?: boolean`: Don't optimize SVG.
 * `--shapeTypes: Array<ShapeTypes>;`: The types of shapes to use when generating the image, as strings, any of: `RECTANGLE`, `ROTATED_RECTANGLE`, `TRIANGLE`, `ELLIPSE`, `ROTATED_ELLIPSE`, `CIRCLE`, `LINE`.
 * `--alpha: number;`: The opacity of the shapes (0-255).
 * `--candidateShapesPerStep: number;`: The number of candidate shapes to try per model step.
 * `--shapeMutationsPerStep: number;`: The number of times to mutate each candidate shape.

### Config file

Using `--config` you can pass a JSON file with configuration. Particularly useful to define complex properties like `--series`. 

Heads up! command arguments will has precedence configuration file. 

Example:

```json
{
  "shapeTypes": "circle,rectangle",
  "series": [ 
    {"iterations": 120}, {"iterations": 380}, {"iterations": 620},
    {"iterations": 1270}, {"iterations": 2220}, {"iterations": 4020}
  ]
}
```

### Series

The option `--series` is an extra feature of this project for generating multiple images in one command. 

See previous section for an example of how to define series using the configuration file.

User can give with an array of options objects and the tool will iterate it (using base options as defaults) and generating images in the folder given by `--output` and appending numbers in the file name, foo/bar001.png, foo/bar002.png. 

This is useful to later generate animated gif or videos or just to better understand how the properties impact in the final image. 

Any option can be changed, even the input files!

#### Executing a program after it finishes

You can use the --postScript property to execute an external program to further processing generated images or clean up. Particularly useful when using with `--series` to build animations, videos or post process the images with an external tool.

#### series and postScript example

```json
{
  "output": "tmp/series2",
  "format": "png",
  "series": [
    {"iterations": 10},{"iterations": 220},{"iterations": 280},{"iterations": 420},{"iterations": 770},{"iterations": 1120},{"iterations": 2220},{"iterations": 4020},{"iterations": 8020}
  ],
  "postScript": "convert -coalesce -delete 0 -deconstruct -loop 0 -delay 18 $(ls tmp/series2/*.png | sort -V) $(ls tmp/series2/*.png | sort -Vr) tmp/series2.gif && rm -rf tmp/series2"
}
```

#### Generating gif animations from Series images

To generate animated gifs you will need ImageMagick. The ImageMagick command is:

```
convert foo/imgs* output.gif -delay 10
```
(use delay for less speed).

[magica](https://www.npmjs.com/package/magica) is a ImageMagick JavaScript port with a similar CLI that that can be easily installed with Node.js `npm install magica -g`. Also, it has an easy to use API for Node.js and the browser. 

#### Generating videos

ffmpeg is a command line video processing and player program that can generate videos from images like this:

```
ffmpeg -framerate 60 -i image-%03d.png video.webm
```

User -framerate to control speed

####

With some work animations in SVGs file can be also produced. 

## Related Projects

 * [geometrizejs](https://www.npmjs.com/package/geometrizejs)
 * [svg-png-converter](https://www.npmjs.com/package/svg-png-converter)
 * [magica](https://www.npmjs.com/package/magica)
 * [mujer](https://www.npmjs.com/package/mujer)
 
## TODO

- [ ] cli: use mujer for optimizing and remove this implementation
- [ ] use svg-to-png-converter to render bitmap formats
- [ ] users cannot use ImageRunner or Bitmap as types
- [ ] integrate magica to generate gifs ? 
- [ ] research on generating SVG animations
- [ ] let postScript be a template so I can reference variable property values defined from the command line. Ex: postScript: "convert <%=output%>/*.<%=format%> <%=output=>/anim.gif"
- [x] document src/options.ts
- [x] options in readme
- [x] tests

## Ideas

 * include magica (image magick) ? (support lots of formats and particularly animated gif) 
 * for little iterations
 * morph 2 different pictures: generate the two with same fwe iterations (200) - let's say rectangles. Then relate rectangles in same aprox locations. And generate intermediate svgs bymoving from the first to the second changing size, color and location. then greate fig. we could use json output to calculate.
 * start writing scripts to generate animations - then we can better consider is create another project with magick and CLI for those scripts