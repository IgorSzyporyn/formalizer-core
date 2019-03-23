import { isEqual } from 'lodash'
import { IXFieldProps } from '../models'
import { OnXFieldChange, SafeXFieldKeys } from '../types'
import { sanitizeValue } from './value'

export function getXFieldProxyHandler<U>(onChange?: OnXFieldChange<U>) {
  return {
    set(xField: IXFieldProps<U>, propName: SafeXFieldKeys<U>, setValue: any) {
      let value = setValue

      if (propName === 'value') {
        value = sanitizeValue(xField, setValue)

        // Fields with object values needs to set child values also
        if (xField.valueType === 'object' && xField.fields) {
          xField.fields.forEach(field => {
            if (value !== undefined) {
              if (!isEqual(value[field.name!], field.value)) {
                field.value = value[field.name!]
              }
            } else if (field.value !== undefined) {
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
