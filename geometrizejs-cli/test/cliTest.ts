import test from 'ava'
import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'

test.before('should build', async t => {
  t.notThrows(() => execSync('npm run build', { stdio: 'pipe' }))
})

test('should render png  triangle,rectangle', async t => {
  t.false(existsSync('tmp/1/panda.png.svg'))
  const r = execSync('node bin/geometrize.js --input test/assets/panda.png --format svg --output tmp/1 --shapeTypes triangle,rectangle --iterations 100', { stdio: 'pipe' });
  const s = readFileSync('tmp/1/panda.png.svg').toString();
  ['<svg', '<polygon', '<rect'].forEach(e=>{
    t.true(s.includes(e), e)
  })
  t.true(s.split('\n').length>100)
})


test('should render jpg ellipse,circle', async t => {
  t.false(existsSync('tmp/2/bluebells.jpg.svg'))
  const r = execSync('node bin/geometrize.js --input test/assets/bluebells.jpg --format svg --output tmp/2 --shapeTypes circle,ellipse --iterations 100', { stdio: 'pipe' });
  ['<svg', '<circle', '<ellipse'].forEach(e=>{
    const s = readFileSync('tmp/2/bluebells.jpg.svg').toString();
    t.true(s.includes(e), e)
  })
})
