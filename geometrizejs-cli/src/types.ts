import { ImageRunnerOptions } from 'geometrizejs'

export interface GeometrizeOptions extends ImageRunnerOptions {
  image: Buffer

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
export interface CliOptions extends GeometrizeOptions {

  /**
   * Path of file to convert. Also could be a glob pattern.
   */
  input: string

  /**
   * If input file is only one, then the output file will be written at this path, if given. If multiple input
   * files are given, then the output files will be written at this folder path. In both cases, folders will
   * be created if they doesn't exists. If not given output files will be written in stdout.  
   */
  output?: string

  /**
   * If [[input]] match a single file and this is defined the output file will be written in this location,
   * creating folders if needed. 
   */
  outputFile?: string

  /**
   *  Print usage information, then exit.
   */
  help?: boolean

  /**
   *  Prints debug messages. 
   */
  debug?: boolean

  /** path to a json file containing this same configuration. Options from command line arguments takes precedence over options in the file.  */
  configFile?: string

  /** If given, Instead of generating one image, it will generate several generates an animation building several images and then building an animated gif or video with them. For providing this information the user should [[configFile]] since via command line gets too complicated.  */
  animSeries?: Partial<CliOptions>[]
}
