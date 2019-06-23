import { isEqual } from 'lodash'
import { ArrayValueType, IXFieldProps, ValueTypes } from '../types'

export function enhanceXFieldWithArrayValues(xField: IXFieldProps) {
  const fields = xField.fields || []
  const fieldValue = xField.value as ArrayValueType

  if (fieldValue == null) {
    const shadowValue: ArrayValueType = []

    fields.forEach(childField => {
      if (childField.value !== undefined) {
        shadowValue.push(childField.value)
      }
    })

    if (fields.length) {
      xField.value = shadowValue
    }
  } else {
    fields.forEach((childField, index) => {
      if (!isEqual(childField.value, fieldValue[index])) {
        childField.value = fieldValue[index]
      }
    })
  }

  fields.forEach((childField, index) => {
    childField.addListener!(({ propName, value }) => {
      const setValue: ValueTypes = value

      if (propName === 'value' && xField.value == null) {
        const shadowValue: ArrayValueType = []

        if (setValue !== undefined) {
          shadowValue[index] = setValue
        }

        xField.value = shadowValue
      } else if (propName === 'value' && xField.value != null) {
        const shadowValue: ArrayValueType = xField.value as ArrayValueType

        shadowValue[index] = setValue

        xField.value = shadowValue
      }
    })
  })
}
