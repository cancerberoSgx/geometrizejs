import test from 'ava'
import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'

test('should render a png to json rectangle', async t => {
  t.false(existsSync('tmp/b1.json'))
  const r = execSync('node bin/geometrize.js --input test/assets/panda.png --noOptimize --output tmp/b1 --shapeTypes  rectangle --iterations 10 --format json', { stdio: 'pipe' })
  const s = readFileSync('tmp/b1.json').toString()
  const json = JSON.parse(s) as any[]
  t.deepEqual(json.length, 10)
  json.forEach(s => {
    t.true(s.type === 0)
  })
})
