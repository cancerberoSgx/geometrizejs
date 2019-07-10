import { readFileSync } from 'fs'
import { getFileNameFromUrl, isNode } from 'misc-utils-of-mine-generic'
import fetch from 'cross-fetch'

import { GeometrizeOptions } from './steps'

export async function resolveInput(options: GeometrizeOptions) {
  if (!isNode()|| isUrl(options.input)) {
    const response = await fetch(options.input)
    if (!response || !response.ok) {
      options.debug && console.log('Cannot fetch image from URL ', options.input, 'Omitting.')
      return null
    }
    const content =  Buffer.from(await response.arrayBuffer())
    return {
      name: getFileNameFromUrl(options.input),
      content
    }
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
