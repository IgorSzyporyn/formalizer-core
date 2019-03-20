import { XFieldProps } from '../models'
import { XFieldListenerCallback } from '../types'
import { getProxyHandler } from './proxyHandler'

export function enhanceXFieldWithListener<ExtraProps>(
  xField: XFieldProps<ExtraProps>
) {
  const listeners: Array<XFieldListenerCallback<ExtraProps>> = []

  xField.addListener = callback => {
    listeners.push(callback)
  }

  const handler = getProxyHandler<ExtraProps>(args => {
    listeners.forEach(listener => {
      listener(args)
    })
  })

  xField = new Proxy(xField, handler)

  return xField
}
