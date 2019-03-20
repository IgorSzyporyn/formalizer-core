import { XFieldProps } from '../models'
import { getProxyHandler } from './proxyHandler'
import { XFieldListenerCallback } from '../types'

export function enhanceXFieldWithListener<ExtraProps>(
  xField: XFieldProps<ExtraProps>
) {
  const listeners: XFieldListenerCallback<ExtraProps>[] = []

  xField.addListener = callback => {
    listeners.push(callback)
  }

  const handler = getProxyHandler<ExtraProps>(({ propName, value, xField }) => {
    listeners.forEach(listener => {
      listener({ propName, value, xField })
    })
  })

  xField = new Proxy(xField, handler)

  return xField
}
