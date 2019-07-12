import { ShapeTypes } from "./shapeTypes"
import { Rect } from './bitmap';

/**
 * Encapsulates the parameters that may be passed to an image runner.
 */
export interface ImageRunnerOptions {
  
  /**
   * The types of shapes to use when generating the image. By default `[ShapeType.TRIANGLE]`.
   */
  shapeTypes?: Array<ShapeTypes>

	/**
	 * The opacity of the shapes (0-255). By default `128`.
	 */
  alpha?: number

	/**
	 * The number of candidate shapes to try per model step. By default `50`.
	 */
  candidateShapesPerStep?: number

	/**
	 * The number of times to mutate each candidate shape. By default `100`.
	 */
  shapeMutationsPerStep?: number  
  
  // /**
  //  * If set only that region of the Bitmap will be considered by the algorithm, this is, 
  //  * shapes only inside that region will be generated, mutated and rasterized.
  //  **/
  //  bitmapOffset?:Rect
}
