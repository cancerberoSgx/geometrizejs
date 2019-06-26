import { ImageRunnerOptions } from 'geometrizejs'
import { ShapeTypes } from 'geometrizejs/dist/src/shapeTypes'

export interface BaseOptions extends ImageRunnerOptions {
  /**
   *  The number shapes that will be generated. On each of these steps the library iteration, the library will generate `candidateShapesPerStep` number of random shapes and `shapeMutationsPerStep` of those are mutated for choosing the shape that better matches the original image regarding colors and bounds. 
   */
  iterations?: number,
  /**
   * Output format. Default: 'svg'
   */
  format?: 'svg' | 'json' | 'png' | 'jpeg'

  /**
   * Don't optimize SVG.
   */
  noOptimize?: boolean

}
export interface CliOptions extends BaseOptions {

  /**
   * Path to files to convert. It accepts one or more, relative or absolute, glob patterns or URLs.
   */
  input: string

  /**
   * If input file is only one, then the output file will be written at this path, if given. If multiple input files are given, then the output files will be written at this folder path. In both cases, folders will be created if they doesn't exists. If not given output files will be written in stdout.  
   */
  output?: string

  /**
   *  Print usage information, then exit.
   */
  help?: boolean

  /**
   *  Prints debug messages. 
   */
  debug?: boolean

  /** 
   * Path to a json file containing this same configuration. Options from command line arguments takes precedence over options in the file.  
   */
  config?: string

  /** 
   * If given, Instead of generating one image, it will generate several generates an animation building several images and then building an animated gif or video with them. For providing this information the user should [[configFile]] since via command line gets too complicated.  
   */
  series?: Partial<CliOptions>[]

  /**
   * In the Command line shape types are referenced by their names, case insensitive: `RECTANGLE`, `ROTATED_RECTANGLE`, `TRIANGLE`, `ELLIPSE`, `ROTATED_ELLIPSE`, `CIRCLE`, `LINE`.
   */
  shapeTypes: ShapeTypes[]

  /**
   * If provided after image are generated successfully it will execute it as a shell command. For example: `convert output/*.png output/flower.gif && rm output/*.png`.
   */
  postScript?: string
}
