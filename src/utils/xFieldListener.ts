import { IXFieldProps, XFieldListenerCallback } from '../types'
import { getXFieldProxyHandler } from './xFieldproxyHandler'

export function enhanceXFieldWithListener<ExtraProps>(
  xField: IXFieldProps<ExtraProps>
) {
  const listeners: Array<XFieldListenerCallback<ExtraProps>> = []

  xField.addListener = callback => {
    listeners.push(callback)
  }

  const handler = getXFieldProxyHandler<ExtraProps>(args => {
    listeners.forEach(listener => {
      listener(args)
    })
  })

  xField = new Proxy(xField, handler)

  return xField
}
