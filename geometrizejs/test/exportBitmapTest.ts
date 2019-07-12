import test from 'ava'
import { mkdirSync } from 'fs'
import Jimp from 'jimp'
import { Bitmap, ImageRunner, ShapeTypes } from '../src'

test('should export bitmap', async t => {
  const image = await Jimp.read('test/assets/logo.png')
  const bitmap = Bitmap.createFromByteArray(image.bitmap.width, image.bitmap.height, image.bitmap.data)
  bitmap.setOffset({ x: 120, y: 50, width: 210, height: 70 })

  const runner = new ImageRunner(bitmap)
  const options = {
    shapeTypes: [ShapeTypes.ROTATED_ELLIPSE, ShapeTypes.RECTANGLE, ShapeTypes.ROTATED_RECTANGLE, ShapeTypes.TRIANGLE, ShapeTypes.LINE, ShapeTypes.QUADRATIC_BEZIER],
    candidateShapesPerStep: 50,
    shapeMutationsPerStep: 100,
    alpha: 128
  }
  const iterations = 100
  for (let i = 0;i < iterations;i++) {
    runner.step(options)
  }
  const bytes = runner.getImageData().getBytes().b
  t.deepEqual(bytes.constructor.name + '', 'Uint8Array')
  const out = new Jimp({
    width: image.bitmap.width,
    height: image.bitmap.height,
    data: bytes
  })
  mkdirSync('tmp/bitmap/', { recursive: true })
  await out.writeAsync('tmp/bitmap/logo.png')
  const out2 = await Jimp.read('tmp/bitmap/logo.png')
  t.deepEqual(out.hash(), out2.hash())
})
