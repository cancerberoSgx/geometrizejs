import test from 'ava'
import { existsSync, readFileSync } from 'fs'
import { Geometrize } from '../src/steps';

test('should load url small', async t => {
  t.false(existsSync('tmp/formUrl.png'))
  let c = 0, d=0
  const job = new Geometrize({
    input: 'test/assets/bluebells.jpg',
    output: 'tmp/formUrl.svg',
    iterations: 10,
    onFinish: result=>{
      d++
    },
    onStep: step=>{
      c++
    }
  })
  const r = await job.start()
  t.true(existsSync('tmp/formUrl.svg'))
  t.deepEqual(10+1, readFileSync('tmp/formUrl.svg').toString().split('<poly').length)
  t.deepEqual(c, 10)
  t.deepEqual(d, 1)
})
