import { mkdirSync, writeFileSync } from 'fs'
import { Bitmap, ImageRunner, ImageRunnerOptions, ShapeJsonExporter, ShapeResult, ShapeTypes, SvgExporter } from 'geometrizejs'
import Jimp from 'jimp'
import { dirname, getFileExtension, isNode } from 'misc-utils-of-mine-generic'
import { optimizeSvg } from 'mujer'
import { svg2png } from 'svg-png-converter'
import { resolveInput } from './resolveInput'

export class Geometrize {
  protected defaultOptions: GeometrizeOptions = {
    alpha: 128,
    input: '',
    shapeTypes: [ShapeTypes.TRIANGLE],
    candidateShapesPerStep: 50,
    shapeMutationsPerStep: 100,
    iterations: 500
  }
  /**
 * Number of steps (number of shaper to generate). Can be changed dynamically while iterating
 */
  iterations: number
  shapeMutationsPerStep: number
  shapeTypes: any
  candidateShapesPerStep: number
  /**
 * Input file path or url. Cannot be changed dynamically.
 */
  input: string
  alpha: number
  onFinish: (result: GeometrizeFinishResult) => void | Promise<void>
  onStep: (step: GeometrizeStepEvent) => void | true | Promise<void | true>
  output: string|undefined
  protected options: Partial<GeometrizeOptions> & { input: string }
  constructor(options: Partial<GeometrizeOptions> & { input: string }) {
    const finalOptions = { ...this.defaultOptions, ...options }
    this.iterations = finalOptions.iterations!
    this.input = finalOptions.input
    this.shapeMutationsPerStep = finalOptions.shapeMutationsPerStep
    this.shapeTypes = finalOptions.shapeTypes
    this.candidateShapesPerStep = finalOptions.candidateShapesPerStep
    this.alpha = finalOptions.alpha
    this.output = finalOptions.output
    this.onStep = finalOptions.onStep || (r => Promise.resolve())
    this.onFinish = finalOptions.onFinish || function() { }
    this.options = options
  }
  async start() {
    const input = await resolveInput(this)
    const image = await Jimp.read(input!.content)
    const bitmap = Bitmap.createFromByteArray(image.bitmap.width, image.bitmap.height, image.bitmap.data)
    const runner = new ImageRunner(bitmap)
    const shapes: ShapeResult[] = []
    for (let i = 0;i < this.iterations;i++) {
      const results = runner.step(this)
      shapes.push(...results)
      if (await this.onStep({ results, shapes, runner })) {
        break
      }
    }
    const r = await this.export({ shapes, runner })
    const results: GeometrizeFinishResult = { shapes, runner, ...r }
    await this.onFinish(results)
    return results
  }

  protected async   export(ev: GeometrizeAbstractEvent) {
    if (this.output) {
      const e = getFileExtension(this.output).toLowerCase()
      isNode() && mkdirSync(dirname(this.output), { recursive: true })
      let content, outputWritten = this.output
      if (!e || e === 'svg') {
        content = SvgExporter.export(ev.shapes, ev.runner.getImageData().width, ev.runner.getImageData().height)
        if (!this.options.noSvgOptimize) {
          content = await optimizeSvg({ ...this.options, input: content })
        }
        content = Buffer.from(content)
      }
      else if (e === 'json') {
        content = ShapeJsonExporter.export(ev.shapes)
        content = Buffer.from(content)
      }
      else {
        content = await svg2png({
          input: SvgExporter.export(ev.shapes, ev.runner.getImageData().width, ev.runner.getImageData().height),
          encoding: 'buffer',
          format: e === 'jpg' ? 'jpeg' : e as any
        })
      }
      isNode() && writeFileSync(outputWritten, content)
      return { ...isNode() ? { outputWritten } : {}, content }
    }
  }
}

export interface GeometrizeOptions extends ImageRunnerOptions {
  /**
   * Input file path or url. Cannot be changed dynamically.
   */
  input: string
  /**
   * Output file to write. Extension will be use to infer output format.
   */
  output?: string
  debug?: boolean
  /**
   * Number of steps (number of shaper to generate)
   */
  iterations?: number
  onFinish?(result: GeometrizeFinishResult): void | Promise<void>
  /**
   * called after each step. If returned true, then the iteration will break.
   */
  onStep?(step: GeometrizeStepEvent): void | true | Promise<void | true>
  noSvgOptimize?: boolean
}

interface GeometrizeFinishResult extends GeometrizeAbstractEvent {
  outputWritten?: string
  content?: Buffer
}

interface GeometrizeStepEvent extends GeometrizeAbstractEvent {
  results: ShapeResult[]
}

interface GeometrizeAbstractEvent {
  shapes: ShapeResult[]
  runner: ImageRunner
}
