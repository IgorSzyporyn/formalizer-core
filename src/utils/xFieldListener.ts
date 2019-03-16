import { XFieldProps } from '../models'
import { getHandler } from './getHandler'
import { XFieldListenerCallback } from '../types'

export function enhanceXFieldWithListener<ExtraProps>(
  xField: XFieldProps<ExtraProps>
) {
  const listeners: XFieldListenerCallback<ExtraProps>[] = []

  xField.addListener = callback => {
    listeners.push(callback)
  }

  const handler = getHandler<ExtraProps>(({ propName, value, xField }) => {
    listeners.forEach(listener => {
      listener({ propName, value, xField })
    })
  })

  xField = new Proxy(xField, handler)

  return xField
}
