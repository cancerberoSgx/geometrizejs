import 'babel-polyfill'
import { serial } from 'misc-utils-of-mine-generic';
import jpgToSvg10 from './tests/jpgToSvg10';
import { assert } from './testUtil';

const all = [
  jpgToSvg10, 
]
serial(all.map(test=>async ()=>{
   try {
  await test()
 } catch ( ex){
   assert(false, ex.toString())
   console.error(ex);   
 }
}))