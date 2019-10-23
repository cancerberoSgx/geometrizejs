import { Bitmap, ImageRunner, ShapeTypes, SvgExporter } from 'geometrizejs'
import { ShapeResult } from 'geometrizer-js'
import Jimp from 'jimp'
import { enumNoValueKeys, sleep } from 'misc-utils-of-mine-generic'
import * as React from 'react'
import { Button, Segment } from 'semantic-ui-react'
import { blobToBuffer, BufferClass } from '../../app/buffer'
import { getStore } from '../../app/store'
import { AbstractComponent } from '../component'

enum ShapeTypesEnum {
  Circle = ShapeTypes.CIRCLE,
  Triangle = ShapeTypes.TRIANGLE,
  Rectangle = ShapeTypes.RECTANGLE,
  ['Rotated Rectangle'] = ShapeTypes.ROTATED_RECTANGLE,
  Ellipse = ShapeTypes.ELLIPSE,
  ['Rotated Ellipse'] = ShapeTypes.ROTATED_ELLIPSE,
  Line = ShapeTypes.LINE,
  ['Quadratic Bezier'] = ShapeTypes.QUADRATIC_BEZIER,
}

export class Options extends AbstractComponent {
  svg: string = ''
  render() {
    return (
      <Segment basic className='loadImage'>
        <label>Choose file
        <input type='file' onChange={async e => {
            if (e.currentTarget.files && e.currentTarget.files.length) {
              const size = e.currentTarget.files[0].size
              const name = e.currentTarget.files[0].name
              const content = await blobToBuffer(e.currentTarget.files[0])
              //TODO verify correct format
              this.setState({ input: { name, size, content } })
            }
          }}></input>
        </label><br />
        <label>Iterations<input type='number' min='1' value={this.state.iterations} onChange={e => {
          this.setState({ iterations: e.currentTarget.valueAsNumber })
        }} /></label><br />
        <label>candidateShapesPerStep<input type='number' min='1' value={this.state.candidateShapesPerStep} onChange={e => {
          this.setState({ candidateShapesPerStep: e.currentTarget.valueAsNumber })
        }} /></label><br />
        <label>Alpha<input type='number' min='1' value={this.state.alpha} onChange={e => {
          this.setState({ alpha: e.currentTarget.valueAsNumber })
        }} /></label><br />
        <label>shapeMutationsPerStep<input type='number' min='1' value={this.state.shapeMutationsPerStep} onChange={e => {
          this.setState({ shapeMutationsPerStep: e.currentTarget.valueAsNumber })
        }} /></label><br />
        <label>stepInterval<input type='number' min='1' value={this.state.stepInterval} onChange={e => {
          this.setState({ stepInterval: e.currentTarget.valueAsNumber })
        }} /></label><br />
        <label>Shapes: <br /><select multiple onChange={e => {
          this.setState({ shapeTypes: Array.from(e.currentTarget.selectedOptions).map(o => parseInt(o.value)) })
        }}>
          {enumNoValueKeys(ShapeTypesEnum).map((shape, i) => <option value={i} selected={this.state.shapeTypes.includes(i)}>{shape}</option>)}
        </select></label><br />
        <Button onClick={async e => {
          this.setState({ working: true })
          this.svg = await geometrize(s => {
            this.svg = this.state.svgContainer!.innerHTML = s
          })
          this.state.svgContainer!.innerHTML = this.svg
          this.setState({
            output: {
              name: 'output.svg',
              content: BufferClass.from(this.svg),
              size: this.svg.length
            },
            working: false
          })
        }}>Geometrize!</Button><br />

        {this.state.working ? <Button onClick={e => {
          this.setState({
            output: {
              name: 'output.svg',
              content: BufferClass.from(this.svg),
              size: this.svg.length
            },
            working: false
          })
        }}>Stop</Button> : ''}
        <br />
        <div>Status: {this.state.working ? 'Working' : 'Idle'}</div>
      </Segment>)
  }
}

async function geometrize(onStep?: (svg: string) => void) {
  let image = await Jimp.read(getStore().getState().input.content)
  image = await image.opaque()
  image = await image.normalize()
  const bitmap = Bitmap.createFromByteArray(image.bitmap.width, image.bitmap.height, image.bitmap.data)
  const runner = new ImageRunner(bitmap)
  const svgData: ShapeResult[] = []
  const interval = setInterval(() => {
    if (onStep) {
      const svg = SvgExporter.getSvgPrelude() + SvgExporter.getSvgNodeOpen(bitmap.width, bitmap.height) + `<rect x="0" y="0" width="${bitmap.width}" height="${bitmap.height}" fill="rgb(61,60,55)" fill-opacity="0.5019607843137255"></rect>` + SvgExporter.exportShapes(svgData) + SvgExporter.getSvgNodeClose()
      onStep(svg)
    }
  }, getStore().getState().stepTimeout)
  for (let i = 0;i < getStore().getState().iterations && getStore().getState().working;i++) {
    svgData.push(...runner.step(getStore().getState()))
    await sleep(getStore().getState().stepInterval || 1)
  }
  clearInterval(interval)
  const svg = SvgExporter.getSvgPrelude() + SvgExporter.getSvgNodeOpen(bitmap.width, bitmap.height) +
    `<rect x="0" y="0" width="${bitmap.width}" height="${bitmap.height}" fill="rgb(61,60,55)" fill-opacity="0.5019607843137255"></rect>` +
    SvgExporter.exportShapes(svgData) + SvgExporter.getSvgNodeClose()
  return svg
}
