import { BaseModel, dvaModel, effect, reducer, subscription } from 'utils/dva'
import createService from '../utils/createService'

interface ICommonState {
  [key: string]: any
}

const DEFAULT_STATE: ICommonState = {
  licensekey: 1,
  data: []
}

@dvaModel('common')
class Common extends BaseModel {
  state: ICommonState = DEFAULT_STATE

  @subscription
  whenLocationChange() {
    console.log('触发了')
  }

  @effect()
  *getLicenseKey(): Generator<any> {
    const res = yield effect.call(createService('api/xxx', 'get'))
    this.effects.put({
      type: 'get',
      data: res
    })
    console.log('res', res)
  }

  @reducer
  get(data: Array<any>) {
    return {
      ...this.state,
      data
    }
  }

  @reducer
  setLicenseKey(licenseKey: string) {
    return {
      ...this.state,
      licenseKey
    }
  }
}

export default new Common().model

declare global {
  interface Actions {
    common: Common
  }
}
