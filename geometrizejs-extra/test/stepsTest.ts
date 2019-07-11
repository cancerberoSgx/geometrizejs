import test from 'ava'
import getFileType from 'file-type'
import { existsSync, readFileSync } from 'fs'
import { ShapeTypes } from 'geometrizejs'
import { Geometrize } from '../src/steps'
import { exportResult } from '../src/export';

test('should iterate given iterations, noOptimize, triangles, input jpg, output svg', async t => {
  t.false(existsSync('tmp/formUrl.png'))
  let c = 0, d = 0
  const job = new Geometrize({
    input: 'test/assets/bluebells.jpg',
    shapeTypes: [ShapeTypes.TRIANGLE],
    iterations: 10,
    onFinish: result => {
      d++
    },
    onStep: step => {
      c++
    }
  })
  const stepsResult = await job.start()
  const exportResults = await exportResult({
    ...stepsResult,
        output: 'tmp/formUrl.svg',
    noSvgOptimize: true,
  })
  t.true(existsSync('tmp/formUrl.svg'))
  t.deepEqual(10 + 1, readFileSync('tmp/formUrl.svg').toString().split('<poly').length)
  t.deepEqual(c, 10)
  t.deepEqual(d, 1)
})

test('should iterate given iterations, optimize, CIRCLE, input png, output jpg', async t => {
  t.false(existsSync('tmp/output2.jpg'))
  let c = 0, d = 0
  const job = new Geometrize({
    input: 'test/assets/panda.png',
    iterations: 10,
    shapeTypes: [ShapeTypes.CIRCLE],
    onFinish: result => {
      d++
    },
    onStep: step => {
      c++
    }
  })
  const stepsResult = await job.start()
  const r = await exportResult({
    ...stepsResult,    
    output: 'tmp/output2.jpg',
  })
  t.true(existsSync('tmp/output2.jpg'))
  t.deepEqual(getFileType(readFileSync('tmp/output2.jpg')), { ext: 'jpg', mime: 'image/jpeg' })
  t.deepEqual(r.output, 'tmp/output2.jpg')
  t.deepEqual(getFileType(r.content!), { ext: 'jpg', mime: 'image/jpeg' })
  t.deepEqual(c, 10)
  t.deepEqual(d, 1)
})
