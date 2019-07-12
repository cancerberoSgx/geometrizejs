import test from 'ava'
import { mkdirSync, writeFileSync } from 'fs'
import Jimp from 'jimp'
import { Bitmap, ImageRunner, ShapeTypes, ImageRunnerOptions, ShapeResult , SvgExporter } from '../src'
import { Rect } from '../src/bitmap';

interface Serie extends ImageRunnerOptions {
  iterations: number
  bitmapOffset?: Rect  
}

test('should change working offset in the bitmap', async t => {
  const image = await Jimp.read('test/assets/parrots.png')
  const bitmap = Bitmap.createFromByteArray(image.bitmap.width, image.bitmap.height, image.bitmap.data)
  const series: Serie[] = [
    {
    iterations: 55,
    shapeTypes: [ShapeTypes.ROTATED_ELLIPSE, ShapeTypes.TRIANGLE],
    alpha: 62,
    candidateShapesPerStep: 42,
    shapeMutationsPerStep: 44,
  }, 
  {
    iterations: 55,
    bitmapOffset: { x: 0, y: 0, width: 333, height: 220 },
    shapeTypes: [ShapeTypes.RECTANGLE],
  }, 
  {
    iterations: 55,
    shapeTypes: [ShapeTypes.TRIANGLE],
    bitmapOffset: { x:  444, y: 0, width: 311, height: 220 },
  },
  {
    iterations: 255,
    shapeTypes: [ShapeTypes.QUADRATIC_BEZIER],
    bitmapOffset: { x:  0, y: 300, width: 688, height: 200 },
    alpha: 196
  }
  ]
  const results: ShapeResult[] = []
  const runner = new ImageRunner(bitmap)
  series.forEach(serie => {
    if (serie.bitmapOffset) {
      runner.setOffset(serie.bitmapOffset)
    } else {
      runner.setOffset()
    }
    for (let i = 0; i < serie.iterations; i++) {
      results.push(...runner.step(serie))
    }
  })
  const bytes = runner.getImageData().getBytes().b
  t.deepEqual(bytes.constructor.name + '', 'Uint8Array')
  const out = new Jimp({
    width: image.bitmap.width,
    height: image.bitmap.height,
    data: bytes
  })
  mkdirSync('tmp/bitmap/', { recursive: true })
  await out.writeAsync('tmp/bitmap/parrots.png')

  const svg = SvgExporter.export(results, image.bitmap.width, image.bitmap.height);
  const expected = ['<?xml', '<svg xmlns="http://www.w3.org/2000/svg"', '</svg>']
  mkdirSync('tmp/svg/', { recursive: true })
  writeFileSync('tmp/svg/parrots.svg', svg)
  expected.forEach(e => t.true(svg.includes(e)))
})
