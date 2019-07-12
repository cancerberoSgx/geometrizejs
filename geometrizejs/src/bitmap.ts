
/**
 * Helper class for working with bitmap data.
 */
export declare class Bitmap {

	/**
	 * The width of the bitmap.
	 */
  width: number

	/**
	 * The height of the bitmap.
	 */
  height: number

  /**
   * Sets the bitmap offset, this is, a region inside relative to which pixel read and write operations are made.
   * Calling this method without parameters will remove the offset and reset to default behavior.
  **/
  public setOffset(offset?: Rect): void

  /**
   *  @returns current offset or null if none.
   */
  public getOffSet(): Rect | undefined

  /**
   * Saves current offset overriding previous saves.
   * @param reset if given it will also remove current offset.
   */
  public saveOffSet(reset?: boolean): void

  /**
   * Restores previously saved offset, if any.
   */
  public restoreOffset(): void

	/**
	 * Creates a new bitmap, filled with the given color.
	 * @param	w		The width of the bitmap.
	 * @param	h		The height of the bitmap.
	 * @param	color	The starting background color of the bitmap.
	 * @return	The new bitmap.
	 */
  static create(w: number, h: number, color: Rgba): Bitmap

	/**
	 * Creates a new bitmap from the supplied byte data.
	 * @param	w		The width of the bitmap.
	 * @param	h		The height of the bitmap.
	 * @param	bytes	The byte data to fill the bitmap with, must be width * height * depth long.
	 * @return	The new bitmap.
	 */
  static createFromBytes(w: number, h: number, bytes: Bytes): Bitmap

  /**
	 * Creates a new bitmap from the supplied native raw byte array. Useful for target language consumers
   * that don't have access to Bytes haxe standar library class. 
	 * @param	w		The width of the bitmap.
	 * @param	h		The height of the bitmap.
	 * @param	bytes	The byte data to fill the bitmap with, must be width * height * depth long.
	 * @return	The new bitmap.
	 */
  static createFromByteArray(w: number, h: number, bytes: number[] | Buffer): Bitmap

	/**
	 * Gets a pixel at the given coordinate.
	 * @param	x	The x-coordinate.
	 * @param	y	The y-coordinate.
	 * @return	The pixel color value.
	 */
  getPixel(x: number, y: number): Rgba

	/**
	 * Sets a pixel at the given coordinate.
	 * @param	x	The x-coordinate.
	 * @param	y	The y-coordinate.
	 * @param	color	The color value to set at the given coordinate.
	 */
  setPixel(x: number, y: number, color: Rgba): void

	/**
	 * Makes a deep copy of the bitmap data.
	 * @return	The deep copy of the bitmap data.
	 */
  clone(): Bitmap

	/**
	 * Fills the bitmap with the given color.
	 * @param	color The color to fill the bitmap with.
	 */
  fill(color: Rgba): void

	/**
	 * Gets the raw bitmap data bytes.
	 * @return	The bitmap data.
	 */
  getBytes(): Bytes

}

export interface Bytes {
  /**
   * Four-channel (rgba) image data as Uint8Array. This is an internal API and could change in the future. 
   */
  b: Uint8Array
}

/**
 * Color representation in red, green, blue, alpha format. 
 */
export type Rgba = number

/**
 * Represents a point or vector in 2D space.
 */
export interface Point {
  x: number
  y: number
}

/**
 *  Represents a rectangle in 2D space.
 */
export interface Rect extends Point {
  width: number
  height: number
}