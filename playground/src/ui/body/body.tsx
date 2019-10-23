import FileSaver from 'file-saver'
import { optimizeSvg } from 'mujer'
import * as React from 'react'
import { Grid, Segment } from 'semantic-ui-react'
import { base64ToUrl } from '../../app/base64'
import { getStore } from '../../app/store'
import { AbstractComponent } from '../component'
import { Options } from './options'

export class Body extends AbstractComponent {

  render() {
    return (
      <Segment basic className='appBody'>
        <Grid>
          <Grid.Column floated='left' width={4}>
            <Options />
          </Grid.Column>
          <Grid.Column floated='right' width={12}>
            <Grid>
              <Grid.Column floated='right' width={8} className='svgColumn'>
                <a href='#' onClick={async e => {
                  const svg = await optimizeSvg({ input: this.state.output.content.toString() })
                  var blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
                  FileSaver.saveAs(blob, this.state.output.name)
                }}>
                  {this.state.output.name}
                </a>
                <div>{Math.round(this.state.output.size / 1000)}KB</div>
                <div ref={c => { getStore().getState().svgContainer = c! }} dangerouslySetInnerHTML={{ __html: this.state.output.content.toString() }}></div>
              </Grid.Column>
              <Grid.Column floated='left' width={8}>
                <a href=''>{this.state.input.name} - {Math.round(this.state.input.size / 1000)}KB</a>
                <img src={base64ToUrl(this.state.input.content.toString('base64'), 'image/png')} />
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid>
      </Segment>)
  }
}


