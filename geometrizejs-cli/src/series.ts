import { mkdirSync } from 'fs'
import { pathJoin, serial } from 'misc-utils-of-mine-generic'
import { CliOptions } from './'
import { geometrizeImage } from './cli'


export interface AnimOptions {
  series: Partial<CliOptions>[]
  // delay?: number
  // noRepeat?: boolean
  // /** automatically append decrement series n-1, n-2, ..., .0 after the incremental ones so the animation go forward and backwards.  */
  // andBack?: boolean
  // animOutputFormat?: 'gif'|'mp4'
}

export async function buildSeries(o: CliOptions) {
  if (!o.output || !o.series) {
    throw new Error('--output and --series are both mandatory to build  animations')
  }
  mkdirSync(o.output, { recursive: true })
  const series: CliOptions[] = [
    ...o.series.map((s, i) => ({
      ...o, ...s,
      output: pathJoin(o.output!, (i + '').padStart(3, '0')) + '.' + (o.format || 'svg')
    }))
  ]
    .map(o => ({ ...o, series: undefined, config: undefined }))
  o.debug && console.log(`Series build starts. Count: ${series}.`)
  await serial(series.map((serie, i) => async () => {
    try {
      o.debug && console.log(`geometrizing serie image ${i}.`);
      await geometrizeImage(serie)
    } catch (error) {
      throw error
    }
  }))
  o.debug && console.log('All Animation series done.')
}
