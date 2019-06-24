import test from 'ava'
import Jimp from 'jimp'
import { Bitmap, ImageRunner, ShapeJsonExporter, ShapeTypes } from '../src'

test('should export JSON', async t => {
  const image = await Jimp.read('test/assets/logo.png')
  const bitmap = Bitmap.createFromByteArray(image.bitmap.width, image.bitmap.height, image.bitmap.data)
  const runner = new ImageRunner(bitmap)
  const options = {
    shapeTypes: [ShapeTypes.CIRCLE],
    candidateShapesPerStep: 50,
    shapeMutationsPerStep: 100,
    alpha: 128
  }
  const iterations = 2
  const shapes = []
  for (let i = 0;i < iterations;i++) {
    shapes.push(ShapeJsonExporter.exportShapes(runner.step(options)))
  }
  shapes.forEach(s => {
    t.deepEqual(JSON.parse(s).type, 5)
  })
})
