import { mkdirSync, writeFileSync } from 'fs'
import { Bitmap, ImageRunner, ImageRunnerOptions, ShapeResult, ShapeTypes, SvgExporter, ShapeJsonExporter } from 'geometrizejs'
import Jimp from 'jimp'
import { dirname, getFileExtension, isNode } from 'misc-utils-of-mine-generic'
import { resolveInput } from './resolveInput'
import { optimizeSvg } from 'mujer'
import { svg2png } from 'svg-png-converter'

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
  onFinish: (result: Result) =>void|Promise<void>;
  onStep: (step: Step) =>  void|true|Promise<void|true>
  output: string | undefined;
  protected options: Partial<GeometrizeOptions> & { input: string; };
  constructor(options: Partial<GeometrizeOptions> & { input: string }) {
    const finalOptions = { ...this.defaultOptions, ...options }
    this.iterations = finalOptions.iterations
    this.input = finalOptions.input
    this.shapeMutationsPerStep = finalOptions.shapeMutationsPerStep
    this.shapeTypes = finalOptions.shapeTypes
    this.candidateShapesPerStep = finalOptions.candidateShapesPerStep
    this.alpha = finalOptions.alpha
    this.output = finalOptions.output
    this.onStep = finalOptions.onStep || (r=>Promise.resolve())
    this.onFinish = finalOptions.onFinish || function() { }
    this.options = options
  }
  async start() {
    const input = await resolveInput(this)
    const image = await Jimp.read(input!.content)
    const bitmap = Bitmap.createFromByteArray(image.bitmap.width, image.bitmap.height, image.bitmap.data)
    const runner = new ImageRunner(bitmap)
    const shapes: ShapeResult[] = []
    for (let i = 0;i < this.iterations;i++) {
      const results = runner.step(this)
      shapes.push(...results)
      if (await this.onStep({ results, shapes, runner })) {
        break
      }
    }
    const r=await this.export(shapes, image);
    const results: Result = { shapes, runner, ...r}
    await this.onFinish(results)
    return results
  }


  protected async   export(shapes: ShapeResult[], image: Jimp) {
    if (this.output) {
      const e = getFileExtension(this.output).toLowerCase();
     isNode()&& mkdirSync(dirname(this.output), { recursive: true });
      let content,  outputWritten=this.output
      if (!e || e === 'svg') {
        content = SvgExporter.export(shapes, image.bitmap.width, image.bitmap.height)
        if(!this.options.noSvgOptimize){
          content = await optimizeSvg({...this.options, input: content})
        }
        content = Buffer.from(content)        
      }      
      else if(e==='json'){
        content = ShapeJsonExporter.export(shapes)
        content = Buffer.from(content)  
      }
      else {
        content = await svg2png({
          input: SvgExporter.export(shapes, image.bitmap.width, image.bitmap.height),
          encoding: 'buffer',
          format: e==='jpg'?'jpeg':e as any
        })
      }
      isNode()&& writeFileSync(outputWritten, content);
      return {...isNode()?{outputWritten}:{}, content}
    }
  }
}

export interface GeometrizeOptions extends ImageRunnerOptions {
  input: string;
  output?: string;
  debug?: boolean
  iterations: number;
  onFinish?(result: Result): void|Promise<void> ;
  /**
   * called after each step. If returned true, then the iteration will break.
   */
  onStep?(step: Step): void|true|Promise<void|true>;
  noSvgOptimize?: boolean
}

interface Result {
  shapes: ShapeResult[]
  runner:ImageRunner
  outputWritten?: string
  content?: Buffer
}

interface Step {
  results: ShapeResult[]
  shapes: ShapeResult[]
  runner:ImageRunner
}
