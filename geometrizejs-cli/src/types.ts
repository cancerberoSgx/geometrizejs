import { ImageRunnerOptions } from 'geometrizejs'

export interface GeometrizeOptions extends ImageRunnerOptions {
  image: Buffer

  iterations?: number,
  /**
   * Output format. Default: 'svg'
   */
  format?: 'svg' | 'json' | 'png' | 'jpg' | 'tiff' | 'gif' | 'bmp'

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
   * If input file is only one then the output file will be written at this path, if given. If multiple input
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
}
