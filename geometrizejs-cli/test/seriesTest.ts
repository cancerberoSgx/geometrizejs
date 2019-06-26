import test from 'ava'
import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'

test('should generate multiple output', async t => {
  t.false(existsSync('tmp/series1/000.svg.svg'))
  t.false(existsSync('tmp/series1/001.svg.svg'))
  const r = execSync('node bin/geometrize.js --config test/assets/series1.json --input test/assets/bluebells.jpg --output tmp/series1', { stdio: 'pipe' })
  t.false(!!['<svg', '<circle'].find(s => !readFileSync('tmp/series1/000.svg.svg').toString().includes(s)))
  t.false(!!['<svg', '<circle'].find(s => !readFileSync('tmp/series1/001.svg.svg').toString().includes(s)))
})
