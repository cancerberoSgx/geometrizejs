import { Bitmap, ImageRunner, ShapeJsonExporter, ShapeTypes, SvgExporter } from 'geometrizejs'
import Jimp from 'jimp'
import { optimizeSvg } from './optimizeSvg'
import { GeometrizeOptions } from './types'

export async function geometrize(o: GeometrizeOptions): Promise<GeometrizeResult> {
  try {
    const image = await Jimp.read(o.image)
    const bitmap = Bitmap.createFromByteArray(image.bitmap.width, image.bitmap.height, image.bitmap.data)
    const runner = new ImageRunner(bitmap)
    const options = {
      ...{
        shapeTypes: [ShapeTypes.TRIANGLE],
        candidateShapesPerStep: 50,
        shapeMutationsPerStep: 100,
        alpha: 128
      },
      ...o
    }
    const iterations = options.iterations || 200
    if (!options.format || options.format === 'svg') {
      return await svg(options, runner, bitmap, o, iterations)
    }
    else if (options.format === 'json') {
      const shapes: string[] = []
      for (let i = 0;i < iterations;i++) {
        shapes.push(ShapeJsonExporter.exportShapes(runner.step(options)))
      }
      return {
        content: Buffer.from('[\n' + shapes.join(',\n  ') + '\n]')
      }
    }
    else {
      throw new Error('Format not supported ' + options.format)
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

async function svg(options: GeometrizeOptions, runner: any, bitmap: any, o: GeometrizeOptions, iterations: number) {
  const svgData = []
  for (let i = 0;i < iterations;i++) {
    svgData.push(SvgExporter.exportShapes(runner.step(options)))
  }
  let svg = SvgExporter.getSvgPrelude() + SvgExporter.getSvgNodeOpen(bitmap.width, bitmap.height) + svgData.join('\n') + SvgExporter.getSvgNodeClose()
  if (!o.noOptimize) {
    svg = await optimizeSvg(svg)
  }
  return {
    content: Buffer.from(svg)
  }
}

