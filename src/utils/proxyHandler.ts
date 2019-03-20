import { OnXFieldChange, SafeXFieldKeys } from '../types'
import { XFieldProps } from '../models'
import { sanitizeValue } from './value'

export function getProxyHandler<U>(onChange?: OnXFieldChange<U>) {
  return {
    set(xField: XFieldProps<U>, propName: SafeXFieldKeys<U>, setValue: any) {
      let value = setValue

      if (propName === 'value') {
        value = sanitizeValue(xField, setValue)

        // fields with object values needs to set child values also
        if (xField.valueType === 'object' && xField.fields) {
          xField.fields.forEach(field => {
            // If value is an object we can look for a new value through
            // key - if it is undefined, then we need to set undefined
            if (value) {
              if (value[field.name!] !== field.value) {
                field.value = value[field.name!]
              }
            } else {
              if (field.value !== undefined) {
                field.value = undefined
              }
            }
          })
        }
      }

      xField[propName] = value

      onChange && onChange({ propName, value, xField })

      return true
    },
  }
}
