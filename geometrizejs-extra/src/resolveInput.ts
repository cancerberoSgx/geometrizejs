import { readFileSync } from 'fs'
import { getFileNameFromUrl } from 'misc-utils-of-mine-generic'
import fetch from 'node-fetch'
import { GeometrizeOptions } from './steps'

export async function resolveInput(options: GeometrizeOptions) {
  if (isUrl(options.input)) {
    const response = await fetch(options.input)
    if (!response || !response.ok) {
      options.debug && console.log('Cannot fetch image from URL ', options.input, 'Omitting.')
      return null
    }
    const content = await response.buffer()
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
