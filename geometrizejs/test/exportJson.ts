import test from 'ava'
import Jimp from 'jimp'
import { Bitmap, ImageRunner, ShapeJsonExporter, ShapeResult, ShapeTypes } from '../src'

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
  const shapes2: ShapeResult[] = []
  for (let i = 0;i < iterations;i++) {
    const r = runner.step(options)
    shapes.push(...JSON.parse(ShapeJsonExporter.exportShapes(r)))
    shapes2.push(...r)
  }
  shapes.forEach(s => {
    t.deepEqual(s.type, 5)
  })
  const s2 = ShapeJsonExporter.export(shapes2)
  const a: any[] = JSON.stringify(s2) as any
  a.forEach(s => {
    t.deepEqual(s.type, 5)
  })
})
