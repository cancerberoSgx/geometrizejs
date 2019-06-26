// import { CliOptions } from '../../src';
// import { mkdirSync } from 'fs';
// import { cli } from '../cli';
// import { pathJoin } from 'misc-utils-of-mine-generic';

// // video ffmpeg https://en.wikibooks.org/wiki/FFMPEG_An_Intermediate_Guide/image_sequence
// // gif : imagemagick gif
// // svg : we could build a svg that animates the imgs too (as bitmaps)

// export interface AnimOptions{
//   series: Partial<CliOptions>[]
//   delay?: number
//   noRepeat?: boolean
//   /** automatically append a serie n-1, n-2, ..., .0 so the animation advance and retrocedes.  */
//   andBack?: boolean
//   animOutputFormat?: 'gif'|'mp4'
// }

// export interface Anim {
//   create(o:Options):void
// }
// interface SeriesOptions extends Options{

// }

// export class Series implements Anim  {
//   create(o:SeriesOptions) {
//     if(!o.output){
//       throw new Error('--output is mandatory to build a series animation')
//     }
//     mkdirSync(o.output);
//     [o, ...o.series.map((s, i)=>({...o, ...s, format: 'png' as any, output: pathJoin(o.output!, (i+'').padStart(3, '0'))}))].forEach(async serie=>{
//       await cli(serie)
//     })
//   }
// }
