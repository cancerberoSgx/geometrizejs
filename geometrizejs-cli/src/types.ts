import { ImageRunnerOptions } from 'geometrizejs'

export interface GeometrizeOptions extends ImageRunnerOptions {
  image: Buffer

  iterations?: number,
  /**
   * Output format. Default: 'svg'
   */
  format?: 'svg' | 'png' | 'jpg' | 'tiff' | 'gif' | 'bmp'

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
   * Folder for output files. If it doesn't exists it will be created. If none, output files will be written
   * in current folder. 
   */
  output?: string

  /**
   * If [[input]] match a single file and this is defined the output file will be written in this location, creating folders if needed. 
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
