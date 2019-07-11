import { Bitmap, ImageRunner, ImageRunnerOptions, ShapeJsonExporter, ShapeResult, ShapeTypes, SvgExporter } from 'geometrizejs'

export interface GeometrizeOptions extends ImageRunnerOptions {
  /**
   * Input file path or url. Cannot be changed dynamically.
   */
  input: string


  debug?: boolean

  /**
   * Number of steps (number of shaper to generate)
   */
  iterations?: number

  onFinish?: FinishListener//(result: GeometrizeFinishResult): void | Promise<void>

  /**
   * called after each step. If returned true, then the iteration will break.
   */
  onStep?: StepListener//(step: GeometrizeStepEvent): void | true | Promise<void | true>


  /**
   * By default when start() finish the tool will export the result to given output option using its extension to infer the file. 
   * If
   */
  noExportOnFinnish?: boolean
}

export interface GeometrizeFinishResult extends GeometrizeExportOptions {
}

export type FinishListener = (e: GeometrizeFinishResult) => void | Promise<void>

export interface GeometrizeStepEvent extends GeometrizeAbstractEvent {
  results: ShapeResult[]
  break?: () => void
}

export type StepListener = (e: GeometrizeStepEvent) => void | true | Promise<void | true>

export interface GeometrizeAbstractEvent {
  shapes: ShapeResult[]
  runner: ImageRunner
}
export interface GeometrizeExportOptions extends GeometrizeAbstractEvent {
  format?: Format
  /** in case no output is given this defines in which form the content will be delivered when exporting output files. */
  encoding?: 'buffer'|'base64'
  /**
   * Node.js only, if given output will be written to that file
   */
  output?: string
  content?: Buffer|string

  noSvgOptimize?: boolean

  // /**
  //  * By default when start() finish the tool will export the result  to this file  and its extension will be use to infer output format.
  //  * If not given, no export will be made and user can call later [[export]] method and provide further configuration such as output format, encoding, etc
  //  */
  // output?: string
}

export type Format = 'svg'|'json'|'png'|'jpeg'

