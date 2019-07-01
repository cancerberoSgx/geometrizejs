import { Shape } from './shape'

/**
 * Container for info about a shape added to the model.
 */
export interface ShapeResult {
  score: number
  color: number
  shape: Shape
}

