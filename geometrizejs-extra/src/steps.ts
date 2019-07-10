import { ShapeTypes, Bitmap, ImageRunner, SvgExporter, ImageRunnerOptions, ShapeResult } from 'geometrizejs';
import Jimp from 'jimp';
import {resolveInput} from './resolveInput'
import { getFileExtension, dirname } from 'misc-utils-of-mine-generic';
import { writeFileSync, mkdirSync } from 'fs';

export class Geometrize {
  protected defaultOptions: GeometrizeOptions = {
    alpha: 128,
    input: '',
    shapeTypes: [ShapeTypes.TRIANGLE],
    candidateShapesPerStep: 50,
    shapeMutationsPerStep: 100,
    iterations: 500
  }
  iterations: number;
  shapeMutationsPerStep: number;
  shapeTypes: any;
  candidateShapesPerStep: number;
  input: string;
  alpha: number;
  onFinish: (result: Result) => void;
  onStep: (step: Step) => void|true;
  output: string | undefined;
  constructor(options: Partial<GeometrizeOptions>&{input: string}) {
    const finalOptions = { ...this.defaultOptions, ...options };
    this.iterations = finalOptions.iterations
    this.input = finalOptions.input
    this.shapeMutationsPerStep = finalOptions.shapeMutationsPerStep
    this.shapeTypes = finalOptions.shapeTypes
    this.candidateShapesPerStep = finalOptions.candidateShapesPerStep
    this.alpha = finalOptions.alpha
    this.output = finalOptions.output
    this.onStep = finalOptions.onStep || function(){}
    this.onFinish = finalOptions.onFinish || function(){}
  }
  async start() {
    const input = await resolveInput(this)
    const image = await Jimp.read(input!.content);
    const bitmap = Bitmap.createFromByteArray(image.bitmap.width, image.bitmap.height, image.bitmap.data);
    const runner = new ImageRunner(bitmap);
    const shapes: ShapeResult[] = [];
    for (let i = 0; i < this.iterations; i++) {
      const results = runner.step(this)      
      shapes.push(...results);
      if(this.onStep({results})){
        break
      }
    }
     this.onFinish({shapes})
     
     if(this.output){
       const e = getFileExtension(this.output).toLowerCase()
       console.log(this.output, e, dirname(this.output+''), getFileExtension(this.output+'').toLowerCase());
       if(!e||e==='svg') {
          mkdirSync(dirname(this.output), {recursive: true})
          writeFileSync(this.output, SvgExporter.export(shapes, image.bitmap.width, image.bitmap.height))
        }
     }
  }

}

export interface GeometrizeOptions extends ImageRunnerOptions{
  input: string;
  output?: string;  
  debug?: boolean
  iterations: number;
  onFinish?(result: Result): void;
  onStep?(step: Step): void;
}

interface Result {
  shapes: ShapeResult[]
}

interface Step {
  results: ShapeResult[]
}
