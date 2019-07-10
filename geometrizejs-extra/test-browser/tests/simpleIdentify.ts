import { assertEquals, log } from '../testUtil';
import { ShapeTypes } from 'geometrizejs'
import {Geometrize} from '../../src'
import { SvgExporter } from 'geometrizejs';
export default async function f(){
  const job = new Geometrize({
    input: 'bluebells.jpg',
    shapeTypes: [ShapeTypes.TRIANGLE],
    iterations: 10,
  })
  const r = await job.start()

  assertEquals(r.shapes.length, 10)
  log(SvgExporter.export(r.shapes, r.runner.getImageData().width, r.runner.getImageData().height))
}

