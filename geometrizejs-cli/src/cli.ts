
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { ShapeTypes } from 'geometrizejs'
import { sync as glob } from 'glob'
import { basename, join } from 'path'
import { geometrize } from './geometrize'
import { CliOptions } from './types'
import { serial } from './util'

export async function traceImage(options: CliOptions) {
  preconditions(options)
  if (options.shapeTypes) {
    // user pass shape types as strings comma separated
    const st: string[] = (options.shapeTypes + '').split(',').map(s => s)
    options.shapeTypes = st.map(s => (ShapeTypes as any)[s.toUpperCase()])
  }
  options.debug && console.log(`CLI Options: ${JSON.stringify({ ...options, input: null })}`)
  const input = (typeof options.input === 'string' ? glob(options.input).filter(existsSync) : [])
    .map(f => ({
      name: f,
      content: readFileSync(f)
    }))
  if (!input.length) {
    fail(`No input files found for ${input}. Aborting. `)
  }
  if (options.output && !existsSync(options.output)) {
    mkdirSync(options.output, { recursive: true })
  }
  await serial(input.map(input => async () => {
    try {
      options.debug && console.log('Rendering ' + input.name)
      const { content, error } = await geometrize({ ...options, image: input.content })
      if (content) {
        if (options.output) {
          const outputFilePath = join(options.output, basename(input.name + '.' + (options.format || 'svg')))
          writeFileSync(outputFilePath, content)
        }
        else {
          process.stdout.write(content.toString('binary'))
        }
      }
      if (error) {
        throw error
      }
    } catch (error) {
      console.error('ERROR while rendering file ' + input)
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

geometrize --input test/assets/panda.png --noOptimize --format svg --output output/folder --shapeTypes triangle,rectangle --iterations 100

Options:

 --input: string: Path of file to convert. Also could be a glob pattern.
 --output?: string: Folder for output files. If it doesn't exists it will be created. If none, output files will be written
in current folder.
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
