import { serial } from 'misc-utils-of-mine-generic'
import { FinishListener, GeometrizeFinishResult, GeometrizeStepEvent, StepListener } from './types'

export class GeometrizeStepsEvent {
  protected stepListeners: StepListener[] = [];
  protected finishListeners: FinishListener[] = [];
  addStepListener(l: StepListener) {
    this.stepListeners.push(l)
  }
  removeStepListener(l: StepListener) {
    this.stepListeners = this.stepListeners.filter(f => f !== l)
  }
  protected async notifyStepListeners(e: GeometrizeStepEvent) {
    var r = await serial(this.stepListeners.map(l => async () => {
      return await l(e);
    }))
    return !!r.find(d => !!d)
  }
  addFinishListener(l: FinishListener) {
    this.finishListeners.push(l)
  }
  removeFinishListener(l: FinishListener) {
    this.finishListeners = this.finishListeners.filter(f => f !== l)
  }
  protected async notifyFinishListeners(e: GeometrizeFinishResult) {
    await serial(this.finishListeners.map(l => async () => {
      return await l(e);
    }))
  }
}
