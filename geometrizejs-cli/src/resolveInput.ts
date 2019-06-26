import { existsSync, readFileSync, statSync, writeFileSync } from 'fs';
import { sync as glob } from 'glob';
import { serial, getFileNameFromUrl } from 'misc-utils-of-mine-generic';
import { CliOptions } from './types';
import { get } from 'hyperquest-promise';

export async function resolveInput(options: CliOptions) {
  const inputNames = (typeof options.input === 'string' && !isUrl(options.input) && !existsSync(options.input) ? glob(options.input) : [options.input])
  .filter(f => isUrl(f) || (existsSync(f) && statSync(f).isFile()));
  
  const input = await serial(inputNames.map(f => async () => {
    if (isUrl(f)) {
      const response = await get(f);
      if (!response || !response.data || response.error) {
        options.debug && console.log('Cannot fetch image from URL ', f, 'Omitting.');        
        return null;
      }
      writeFileSync('tmp_test.png',response.data )
      return {
        name: getFileNameFromUrl(f),
        content:response.data
      };
    }
    else {
      return {
        name: f,
        content: readFileSync(f)
      }
    }
  }));
  return input;
}

function isUrl(f: string) {
  return f.startsWith('http://') || f.startsWith('https://');
}
