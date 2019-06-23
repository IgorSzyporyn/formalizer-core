import { isEqual } from 'lodash'
import { IValue, IXFieldProps, ValueTypes } from '../types'

export function enhanceXFieldWithObjectValues(xField: IXFieldProps) {
  const fields = xField.fields || []
  const fieldValue = xField.value as IValue

  if (fieldValue == null) {
    const shadowValue: IValue = {}

    fields.forEach(childField => {
      if (childField.value !== undefined) {
        shadowValue[childField.name!] = childField.value
      }
    })

    if (fields.length) {
      xField.value = shadowValue
    }
  } else {
    fields.forEach(childField => {
      if (!isEqual(childField.value, fieldValue[childField.name!])) {
        childField.value = fieldValue[childField.name!]
      }
    })
  }

  fields.forEach(childField => {
    childField.addListener!(({ propName, value }) => {
      const setValue: ValueTypes = value

      if (propName === 'value' && xField.value == null) {
        const shadowValue: IValue = {}

        if (setValue !== undefined) {
          shadowValue[childField.name!] = setValue
        }

        xField.value = shadowValue
      } else if (propName === 'value' && xField.value != null) {
        const shadowValue: IValue = xField.value as IValue

        if (setValue === undefined) {
          delete shadowValue[childField.name!]
        } else {
          shadowValue[childField.name!] = setValue
        }

        xField.value = shadowValue
      }
    })
  })
}
