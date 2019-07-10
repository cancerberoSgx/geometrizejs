import 'babel-polyfill'
import { serial } from 'misc-utils-of-mine-generic';
import simpleIdentify from './tests/simpleIdentify';
import { assert } from './testUtil';

const all = [
  simpleIdentify, 
]
serial(all.map(test=>async ()=>{
   try {
  await test()
 } catch ( ex){
   assert(false, ex.toString())
   console.error(ex);   
 }
}))