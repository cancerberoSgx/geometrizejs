/**
 * Represents a scanline, a row of pixels running across a bitmap.
 */
export interface Scanline {

  /**
   * The y-coordinate of the scanline.
   */
  y: number

  /**
   * The leftmost x-coordinate of the scanline.
   */
  x1: number

  /**
   * The rightmost x-coordinate of the scanline.
   */
  x2: number

}
