import { Bitmap, Rect } from './bitmap'
import { ImageRunnerOptions } from './imageRunnerOptions'
import { ShapeResult } from './model'

export interface ImageRunnerConstructor {
  /**
   * Creates a new runner.
   * @param	inputImage	The input image, the image that the algorithm will optimize for.
   */
  new(inputImage: Bitmap): ImageRunner;
}

/**
 * Helper class for creating a set of shapes that approximate a source image.
 */
export interface ImageRunner {

  /**
   * Updates the model once.
   * @return	An array containing data about the shapes just added to the model.
   */
  step(options: ImageRunnerOptions): Array<ShapeResult>;

  /**
   * Gets the current bitmap with the shapes drawn on it.
   * @return	The current bitmap.
   */
  getImageData(): Bitmap

  /**
   * The algorithm will only consider a region of the entire bitmap. 
   * If null is passed it will reset the offset (default behaviour)
   * New shapes will be generated randombly but only inside this region.
   * 
   */
  setOffset(offset?: Rect): void

}
