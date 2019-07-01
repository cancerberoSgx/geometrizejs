import { Scanline } from './scanline'
import { ShapeTypes } from './shapeTypes'

/**
 * Container for info about a shape added to the model.
 */
export interface ShapeResult {
  score: number
  color: number
  shape: Shape
}

/**
 * Interface for shape rasterization and manipulation.
 */
export interface Shape {
	/**
	 * Creates a raster scanline representation of the shape.
	 * @return	Array of raster scanlines representing the shape.
	 */
  rasterize(): Scanline[]

	/**
	 * Modifies the shape a little, typically with a random component.
	 * For improving the shape's fit to a bitmap (trial-and-error style).
	 */
  mutate(): void;

	/**
	 * Creates a deep copy of the shape.
	 * @return	A deep copy of the shape object.
	 */
  clone(): Shape;

	/**
	 * Gets the ShapeType of the shape.
	 * @return The ShapeType of the shape.
	 */
  getType(): ShapeTypes[keyof ShapeTypes];

	/**
	 * Gets a vector of data that represents the shape geometry, the format varies depending on the ShapeType.
	 * @return The shape data.
	 */
  getRawShapeData(): number[];

	/**
	 * Gets a string that represents a SVG element that describes the shape geometry.
	 * @return The SVG shape data that represents this shape.
	 */
  getSvgShapeData(): string;
}
