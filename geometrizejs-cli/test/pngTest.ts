import test from 'ava'
import { execSync } from 'child_process'
import fileType from 'file-type'
import { existsSync, readFileSync } from 'fs'

// test.before('should build', async t => {
//   t.notThrows(() => execSync('npm run build', { stdio: 'pipe' }))
// })

test('should render a png to png rotated_rectangle', async t => {
  t.false(existsSync('tmp/out.png'))
  const r = execSync('node bin/geometrize.js --input test/assets/panda.png --noOptimize --output tmp/out --shapeTypes rotated_rectangle --iterations 10 --format png', { stdio: 'pipe' })
  t.deepEqual(fileType(readFileSync('tmp/out.png')), { ext: 'png', mime: 'image/png' })
})
