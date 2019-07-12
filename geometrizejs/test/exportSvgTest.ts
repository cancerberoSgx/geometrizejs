import test from 'ava'
import Jimp from 'jimp'
import { Bitmap, ImageRunner, ShapeTypes, SvgExporter, ShapeResult } from '../src'
import { mkdirSync, writeFileSync } from 'fs';

test('should export SVG', async t => {
  const image = await Jimp.read('test/assets/logo.png')
  const bitmap = Bitmap.createFromByteArray(image.bitmap.width, image.bitmap.height, image.bitmap.data)
  bitmap.setOffset({x: 120, y: 70, width:120, height: image.bitmap.height-70})
  const runner = new ImageRunner(bitmap)
  const options = {
    shapeTypes: [ShapeTypes.RECTANGLE],
    candidateShapesPerStep: 50,
    shapeMutationsPerStep: 100,
    alpha: 128
  }
  const iterations = 100
  const shapes: ShapeResult[] = []
  for (let i = 0;i < iterations;i++) {
    shapes.push(...runner.step(options));
  }
  // bitmap.setOffset();
  //@ts-ignore
  // shapes.forEach(s=>{s.shape.translate({x: 100, y: 40})})
  const svg = SvgExporter.export(shapes, image.bitmap.width, image.bitmap.height);//getSvgPrelude() + SvgExporter.getSvgNodeOpen(bitmap.width, bitmap.height) + svgData.join('\n') + SvgExporter.getSvgNodeClose()

  const expected = ['<?xml', '<svg xmlns="http://www.w3.org/2000/svg"', '<rect', '</svg>']

  mkdirSync('tmp/svg/', { recursive: true })
  writeFileSync('tmp/svg/test1.svg', svg)
  expected.forEach(e => t.true(svg.includes(e)))
})
