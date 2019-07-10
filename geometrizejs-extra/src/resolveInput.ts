import { existsSync, readFileSync, statSync } from 'fs'
import { sync as glob } from 'glob'
import { getFileNameFromUrl, serial } from 'misc-utils-of-mine-generic'
import fetch from 'node-fetch'
import { GeometrizeOptions } from './steps';

export async function resolveInput(options: GeometrizeOptions) {
  // const inputNames = (typeof options.input === 'string' && !isUrl(options.input) && !existsSync(options.input) ? glob(options.input) : [options.input])
  //   .filter(f => isUrl(f) || (existsSync(f) && statSync(f).isFile()))

  // const input = await serial(inputNames.map(f => async () => {
    if (isUrl(options.input)) {
      const response = await fetch(options.input)
      // const response = await get(f);
      if (!response || !response.ok) {
        options.debug && console.log('Cannot fetch image from URL ', options.input, 'Omitting.');
        return null;
      }
      const content = await response.buffer()
      // writeFileSync('tmp_test.png', content)
      return {
        name: getFileNameFromUrl(options.input),
        content
      };
    }
    else {
      return {
        name: options.input,
        content: readFileSync(options.input)
      }
    }
}

function isUrl(f: string) {
  return f.startsWith('http://') || f.startsWith('https://')
}
