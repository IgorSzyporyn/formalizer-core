import { isArray, isEqual, isPlainObject } from 'lodash'
import {
  IXFieldProps,
  OnXFieldChange,
  SafeXFieldKeys,
  XFieldListenerCallback,
} from '../types'
import { sanitizeValue } from './value'

export const getXFieldProxyHandler = <U>(onChange?: OnXFieldChange<U>) => {
  return {
    set(xField: IXFieldProps<U>, propName: SafeXFieldKeys<U>, setValue: any) {
      let value = setValue

      if (propName === 'value') {
        value = sanitizeValue(xField, setValue)

        // Fields with object values needs to set child values also
        if (xField.valueType === 'object' && xField.fields) {
          xField.fields.forEach(field => {
            if (isPlainObject(value)) {
              if (!isEqual(value[field.name!], field.value)) {
                field.value = value[field.name!]
              }
            } else {
              field.value = undefined
            }
          })
        }

        // Fields with array values needs to set child values also
        if (xField.valueType === 'array' && xField.fields) {
          xField.fields.forEach((field, index) => {
            if (isArray(value)) {
              if (!isEqual(value[index], field.value)) {
                field.value = value[index]
              }
            } else {
              field.value = undefined
            }
          })
        }
      }

      xField[propName] = value

      if (onChange) {
        onChange({ propName, value, xField })
      }

      return true
    },
  }
}

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
