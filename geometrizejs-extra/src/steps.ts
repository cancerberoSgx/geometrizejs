import { Bitmap, ImageRunner, ImageRunnerOptions, ShapeResult, ShapeTypes } from 'geometrizejs'
import Jimp from 'jimp'
import { Emitter, notUndefined } from 'misc-utils-of-mine-generic'
import { resolveInput } from './resolveInput'
import { GeometrizeFinishResult, GeometrizeOptions } from './types';
import { exportResult } from './export';
import { GeometrizeStepsEvent } from './event';

export class Geometrize extends GeometrizeStepsEvent {
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
  // output: string | undefined
  protected options: Partial<GeometrizeOptions> & { input: string }

  constructor(options: Partial<GeometrizeOptions> & { input: string }) {
    super()
    const finalOptions = { ...this.defaultOptions, ...options }
    this.iterations = finalOptions.iterations!
    this.input = finalOptions.input
    this.shapeMutationsPerStep = finalOptions.shapeMutationsPerStep
    this.shapeTypes = finalOptions.shapeTypes
    this.candidateShapesPerStep = finalOptions.candidateShapesPerStep
    this.alpha = finalOptions.alpha
    // this.output = finalOptions.output
    options.onStep && this.addStepListener(options.onStep)
    options.onFinish && this.addFinishListener(options.onFinish)
    this.options = options
  }
// protected shapes: ShapeResult[] = []
/**
 * Will start step iteration reseting any previous run.
 */
  async start() {
    const input = await resolveInput(this)
    const image = await Jimp.read(input!.content)
    const bitmap = Bitmap.createFromByteArray(image.bitmap.width, image.bitmap.height, image.bitmap.data)
    const runner = new ImageRunner(bitmap)
    const shapes = []
    for (let i = 0; i < this.iterations; i++) {
      const results = runner.step(this)
      shapes.push(...results)
      const e = { results, shapes, runner}
      if (await this.notifyStepListeners(e)) {
        break
      }
    }
    const r2 = { shapes, runner }
    const r = await exportResult(r2)
    const results: GeometrizeFinishResult = { ...r2, ...r }
    await this.notifyFinishListeners(results)
    return results
  }

  async pause(){}
  async resume(){}

}


