import { mkdirSync, writeFileSync } from 'fs'
import { ShapeJsonExporter, SvgExporter } from 'geometrizejs'
import { dirname, getFileExtension, isNode } from 'misc-utils-of-mine-generic'
import { optimizeSvg } from 'mujer'
import { svg2png } from 'svg-png-converter'
import { GeometrizeExportOptions } from './types'

export async function exportResult(options: GeometrizeExportOptions) {
  if (options.output) {
    if (!isNode()) {
      throw new Error('option output can only be specified in node.js since requires writing to a file.')
    }
    const output = options.output
    mkdirSync(dirname(output), { recursive: true })
    let content = await exportOutputImage(options)
    writeFileSync(output, content)
    return { output, content }
  }
  else {
    let content = await exportOutputImage(options)
    return { content }
    // throw 1
  }
}
async function exportOutputImage(options: GeometrizeExportOptions) {
  const e = options.format || options.output ? getFileExtension(options.output!).toLowerCase() : 'png'
  let content
  if (!e || e === 'svg') {
    content = SvgExporter.export(options.shapes, options.runner.getImageData().width, options.runner.getImageData().height)
    if (!options.noSvgOptimize) {
      content = await optimizeSvg({ ...options, input: content })
    }
    content = Buffer.from(content)
  }
  else if (e === 'json') {
    content = ShapeJsonExporter.export(options.shapes)
    content = Buffer.from(content)
  }
  else {
    content = await svg2png({
      input: SvgExporter.export(options.shapes, options.runner.getImageData().width, options.runner.getImageData().height),
      encoding: 'buffer',
      format: e === 'jpg' ? 'jpeg' : e as any
    }) as Buffer
  }
  return content
}
