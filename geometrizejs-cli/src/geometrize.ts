import Jimp from 'jimp'
import {ShapeTypes, Bitmap, ImageRunner, SvgExporter, ImageRunnerOptions} from 'geometrizejs'
import { CliOptions, GeometrizeOptions } from './types';
import { optimizeSvg } from './optimizeSvg';

export async function geometrize(o: GeometrizeOptions): Promise<GeometrizeResult>{
  try {      
  const image = await Jimp.read(o.image)
  const bitmap = Bitmap.createFromByteArray(image.bitmap.width, image.bitmap.height, image.bitmap.data)
  const runner = new ImageRunner(bitmap)
  const options = {
    ...{
      shapeTypes: [ShapeTypes.TRIANGLE ],
    candidateShapesPerStep: 50,
    shapeMutationsPerStep: 100,
    alpha: 128
  }, 
  ...o
  }
  const iterations = options.iterations||200
  const svgData = []
  for (let i = 0;i < iterations;i++) {
    svgData.push(SvgExporter.exportShapes(runner.step(options)))
  }
  let svg = SvgExporter.getSvgPrelude() + SvgExporter.getSvgNodeOpen(bitmap.width, bitmap.height) + svgData.join('\n') + SvgExporter.getSvgNodeClose()
  if(!o.noOptimize){
    svg = await optimizeSvg(svg)
  }
  return {
    content: Buffer.from(svg)
  }
} catch (error) {
  return {
    error
  }
}
}

export interface GeometrizeResult {
  content?: Buffer
  error?: Error
}

