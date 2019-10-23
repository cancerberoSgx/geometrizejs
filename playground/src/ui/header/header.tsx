import * as React from 'react'
import { Dropdown, Menu, Modal } from 'semantic-ui-react'
import { createUrl } from '../common/uiUtil'
import { AbstractComponent } from '../component'
import { About } from './about'

export class Header extends AbstractComponent {
  render() {
    return (<Menu>
      <Menu.Menu position='right'>
        <Dropdown item text='Examples' >
          <Dropdown.Menu>
            <Dropdown.Item text='TODO' onClick={e => { }} />
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown item text='More'>
          <Dropdown.Menu>
            <Dropdown.Item icon='edit' text='Create Url' onClick={createUrl} />
            <Modal trigger={<Dropdown.Item icon='help circle' text='About' />}>
              <Modal.Header>About</Modal.Header>
              <Modal.Content>
                <About />
              </Modal.Content>
            </Modal>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
    </Menu>)
  }
}

