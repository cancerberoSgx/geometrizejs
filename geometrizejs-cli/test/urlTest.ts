import test from 'ava'
import { execSync } from 'child_process'
import fileType from 'file-type'
import { existsSync, readFileSync } from 'fs'

test('should load url', async t => {
  t.false(existsSync('tmp/formUrl.png'))
  const r = execSync('node bin/geometrize.js --input "https://cancerberosgx.github.io/demos/WASM-ImageMagick/supported-formats/formats/to_rotate.jpg" --noOptimize --output tmp/formUrl --shapeTypes rotated_rectangle --iterations 10 --format png --debug', { stdio: 'pipe' })
  t.deepEqual(fileType(readFileSync('tmp/formUrl.png')), { ext: 'png', mime: 'image/png' })
})
