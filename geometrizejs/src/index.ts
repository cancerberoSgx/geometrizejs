import { Bitmap as BitmapClass } from './bitmap'
import { ImageRunnerConstructor,  ImageRunner as ImageRunnerClass} from './imageRunner'
import { ShapeJsonExporter as ShapeJsonExporterClass } from './shapeJsonExporter'
import { ShapeTypes as ShapeTypesClass } from './shapeTypes'
import { SvgExporter as SvgExporterClass } from './svgExporter'

const { geometrize } = require('./geometrize')

export const ImageRunner = geometrize.runner.ImageRunner as ImageRunnerConstructor
export type ImageRunner  = ImageRunnerClass
export const Bitmap = geometrize.bitmap.Bitmap as typeof BitmapClass
export type Bitmap  = BitmapClass
export const ShapeTypes = geometrize.shape.ShapeTypes as typeof ShapeTypesClass
export const SvgExporter = geometrize.exporter.SvgExporter as typeof SvgExporterClass
export const ShapeJsonExporter = geometrize.exporter.ShapeJsonExporter as typeof ShapeJsonExporterClass
export { ImageRunnerOptions } from './imageRunnerOptions'
export { ShapeResult } from './model'
