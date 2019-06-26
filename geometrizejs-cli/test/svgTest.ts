import test from 'ava'
import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'

// test.before('should build', async t => {
//   t.notThrows(() => execSync('npm run build', { stdio: 'pipe' }))
// })

test('should render a png to svg triangle,rectangle', async t => {
  t.false(existsSync('tmp/1.svg'))
  const r = execSync('node bin/geometrize.js --input test/assets/panda.png --noOptimize --format svg --output tmp/1 --shapeTypes triangle,rectangle --iterations 100', { stdio: 'pipe' })
  const s = readFileSync('tmp/1.svg').toString();
  ['<svg', '<polygon', '<rect'].forEach(e => {
    t.true(s.includes(e), e)
  })
  t.true(s.split('\n').length > 100)
})


test('should render a jpg tp svg ellipse,circle', async t => {
  t.false(existsSync('tmp/2.svg'))
  const r = execSync('node bin/geometrize.js --input test/assets/bluebells.jpg --noOptimize --format svg --output tmp/2 --shapeTypes circle,ellipse --iterations 100', { stdio: 'pipe' })
  const s = readFileSync('tmp/2.svg').toString();
  ['<svg', '<circle', '<ellipse'].forEach(e => {
    t.true(s.includes(e), e)
  })
})

test('should optimize svg by default', async t => {
  t.false(existsSync('tmp/3.svg'))
  execSync('node bin/geometrize.js --input test/assets/bluebells.jpg --format svg --output tmp/3 --shapeTypes rectangle --iterations 1', { stdio: 'pipe' })
  const s = readFileSync('tmp/3.svg').toString();
  ['<svg', '<path'].forEach(e => {
    t.true(s.includes(e), e)
  })
  t.false(s.includes('rect'))

  t.false(existsSync('tmp/4.svg'))
  execSync('node bin/geometrize.js --input test/assets/bluebells.jpg --format svg --noOptimize --output tmp/4 --shapeTypes rectangle --iterations 1', { stdio: 'pipe' })
  const s2 = readFileSync('tmp/4.svg').toString();
  ['<svg', '<rect'].forEach(e => {
    t.true(s2.includes(e), e)
  })
  t.false(s2.includes('<path'))
  t.true(s.length < s2.length)
})
