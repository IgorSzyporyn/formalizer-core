import { isEqual } from 'lodash'
import { XFieldProps } from '../models'
import { OnXFieldChange, SafeXFieldKeys } from '../types'
import { sanitizeValue } from './value'

export function getProxyHandler<U>(onChange?: OnXFieldChange<U>) {
  return {
    set(xField: XFieldProps<U>, propName: SafeXFieldKeys<U>, setValue: any) {
      let value = setValue

      if (propName === 'value') {
        value = sanitizeValue(xField, setValue)

        // Fields with object values needs to set child values also
        if (xField.valueType === 'object' && xField.fields) {
          xField.fields.forEach(field => {
            // To prevent a recursive chain of calls up and down between
            // child and parent we need some specific logic here
            if (value) {
              // If parent has value - then only change if there is a
              // difference between the values
              if (!isEqual(value[field.name!], field.value)) {
                field.value = value[field.name!]
              }
            } else if (field.value !== undefined) {
              // Our parents value is undefined, so this field must set
              // its value to undefined
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
