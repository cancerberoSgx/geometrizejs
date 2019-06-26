import test from 'ava'
import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'

test.before('should build', async t => {
  t.notThrows(() => execSync('npm run build', { stdio: 'pipe' }))
})

test('should get config from json', async t => {
  t.false(existsSync('tmp/series1.svg'))
  const r = execSync('node bin/geometrize.js --configFile test/assets/series1.json  --input test/assets/bluebells.jpg --noOptimize', { stdio: 'pipe' })
  t.false(!!['<svg', '<circle'].find(s => !readFileSync('tmp/series1.svg').toString().includes(s)))
})
