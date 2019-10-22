import test from 'ava'
import getFileType from 'file-type'
import { existsSync, readFileSync } from 'fs'
import { ShapeTypes } from 'geometrizejs'
import { exportResult } from '../src/export'
import { Geometrize } from '../src/steps'

test.todo('should export to svg')
test.todo('should export to bitmap')
