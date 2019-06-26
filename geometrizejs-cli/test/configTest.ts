import test from 'ava'
import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'

test('should get config from json', async t => {
  t.false(existsSync('tmp/config1.svg'))
  const r = execSync('node bin/geometrize.js --config test/assets/config1.json  --input test/assets/bluebells.jpg', { stdio: 'pipe' })
  t.false(!!['<svg', '<circle'].find(s => !readFileSync('tmp/config1.svg').toString().includes(s)))
})
