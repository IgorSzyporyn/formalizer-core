import { OnXFieldChange, SafeXFieldKeys } from '../types'
import { XFieldProps } from '../models'
import { sanitizeValue } from './valueConversion'

export function getHandler<U>(onChange?: OnXFieldChange<U>) {
  return {
    set(xField: XFieldProps<U>, propName: SafeXFieldKeys<U>, setValue: any) {
      const value = sanitizeValue(xField, setValue)

      // If valueType is object we need to go through all first level fields
      // and assign a possible key value from our value object store
      if (xField.valueType === 'object' && xField.fields) {
        xField.fields.forEach(field => {
          if (field.name && value && value[field.name] !== field.value) {
            field.value = value[field.name]
          }
        })
      }

      xField[propName] = value

      onChange && onChange({ propName, value, xField })

      return true
    },
  }
}
