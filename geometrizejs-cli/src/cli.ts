
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import { ShapeTypes } from 'geometrizejs'
import { sync as glob } from 'glob'
import { serial } from 'misc-utils-of-mine-generic'
import { basename, dirname, join } from 'path'
import { geometrize } from './geometrize'
import { CliOptions } from './types'

export async function cli(options: CliOptions) {
  let fileConfig = {}
  if(options.configFile){
    try {
      fileConfig = JSON.parse(readFileSync(options.configFile).toString())
    } catch (error) {
      fail('Cannot parse given config file '+options.configFile+'. Aborting. ')
    }
  }
  options = {...fileConfig, ...options}
  preconditions(options)
  if (options.shapeTypes) {
    // user pass shape types as strings comma separated
    const st: string[] = (options.shapeTypes + '').split(',').map(s => s)
    options.shapeTypes = st.map(s => (ShapeTypes as any)[s.toUpperCase()])
  }
  options.debug && console.log(`CLI Options: ${JSON.stringify({ ...options, input: null })}`)
  const input = (typeof options.input === 'string' ? glob(options.input) : [])
    .filter(f => existsSync(f) && statSync(f).isFile())
    .map(f => ({
      name: f,
      content: readFileSync(f)
    }))

  if (!input.length) {
    fail(`No input files found for ${input}. Aborting. `)
  }

  await serial(input.map(f => async () => {
    try {
      options.debug && console.log('Rendering ' + f.name)
      let { content, error } = await geometrize({ ...options, image: f.content })
      console.log('geom executed', error, content && content.toString().length);

      if (content) {
        if (options.output) {
          let outputFilePath = options.output + '.' + (options.format || 'svg')
          if (input.length > 1) {
            !existsSync(options.output) && mkdirSync(options.output, { recursive: true })
            outputFilePath = join(options.output, basename(f.name + '.' + (options.format || 'svg')))
          }
          else if (!existsSync(dirname(options.output))) {
            mkdirSync(dirname(options.output), { recursive: true })
          }
          writeFileSync(outputFilePath, content)
        }
        else {
          process.stdout.write(content ? content.toString('binary') : 'ERROR')
        }
      }
      if (error) {
        throw error
      }
    } catch (error) {
      console.error('ERROR while rendering file ' + f)
      console.error(error, error.stack)
    }
  }))
}

function preconditions(options: CliOptions) {
  if (options.help) {
    printHelp()
    process.exit(0)
  }
  if (!options.input) {
    fail('--input argument is mandatory but not given. Aborting.')
  }
}

function fail(msg: string) {
  console.error(msg)
  process.exit(1)
}

function printHelp() {
  console.log(`
Usage: 

  geometrize --input test/assets/panda.png --noOptimize --format svg \
    --output output/folder --shapeTypes triangle,rectangle --iterations 100

Options:

  --input: string: Path of file to convert. Also could be a glob pattern.
  --output?: string: If input file is only one then the output file will be written at this path, if given. If multiple input files are given, then the output files will be written at this folder path. In both cases, folders will be created if they doesn't exists. If not given output files will be written in stdout.
  --outputFile?: string: If [[input]] match a single file and this is defined the output file will be written in this location,creating folders if needed.
  --help?: boolean:  Print usage information, then exit.
  --debug?: boolean:  Prints debug messages.
  --image: Buffer:
  --iterations?: number,:
  --format?: 'svg' | 'json' | 'png' | 'jpg' | 'tiff' | 'gif' | 'bmp': Output format. Default: 'svg'
  --noOptimize?: boolean: Don't optimize SVG.
  --shapeTypes: Array<ShapeTypes>;: The types of shapes to use when generating the image.
  --alpha: number;: The opacity of the shapes (0-255).
  --candidateShapesPerStep: number;: The number of candidate shapes to try per model step.
  --shapeMutationsPerStep: number;: The number of times to mutate each candidate shape.

`)
}
