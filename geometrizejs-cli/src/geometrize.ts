import { Bitmap, ImageRunner, ShapeJsonExporter, ShapeTypes, SvgExporter } from 'geometrizejs'
import Jimp from 'jimp'
import { svg2png } from 'svg-png-converter'
import { OutputFormat } from 'svg-png-converter/dist/src/types'
import { optimizeSvg } from './optimizeSvg'
import { BaseOptions } from './types'

export interface GeometrizeResult {
  content?: Buffer
  error?: Error
}

interface Options extends BaseOptions {
  image: Buffer
}

/**
 * Implements the dialog directly with geometrizejs by iterating, creating bimap, etc. Uses jimp to read images and create bitmap. Output a SVG string.
 */
export async function geometrize(o:  Options): Promise<GeometrizeResult> {
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
    } else {
      const { content } = await svg(options, runner, bitmap, o, iterations)
      return {
        content: await svg2png({
          input: content ? content.toString() : '',
          encoding: 'buffer',
          format: options.format as OutputFormat
        })
      }

    }
  } catch (error) {
    return {
      error
    }
  }
}

async function svg(options: BaseOptions, runner: any, bitmap: any, o: BaseOptions, iterations: number) {
  const svgData = []
  for (let i = 0;i < iterations;i++) {
    svgData.push(SvgExporter.exportShapes(runner.step(options)))
  }
  let svg = SvgExporter.getSvgPrelude() + SvgExporter.getSvgNodeOpen(bitmap.width, bitmap.height) + svgData.join('\n') + SvgExporter.getSvgNodeClose()
  if (!o.noOptimize && (!options.format || options.format === 'svg')) {
    svg = await optimizeSvg(svg)
  }
  return {
    content: Buffer.from(svg)
  }
}

