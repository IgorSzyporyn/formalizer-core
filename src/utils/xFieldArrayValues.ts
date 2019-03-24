import { isEqual } from 'lodash'
import { IXFieldProps } from '../models'
import { ArrayValue, ValueTypes } from '../types'

export function enhanceXFieldWithArrayValues<E>(xField: IXFieldProps<E>) {
  const fields = xField.fields || []
  const fieldValue = xField.value as ArrayValue

  if (fieldValue == null) {
    const shadowValue: ArrayValue = []

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
        const shadowValue: ArrayValue = []

        if (setValue !== undefined) {
          shadowValue[index] = setValue
        }

        xField.value = shadowValue
      } else if (propName === 'value' && xField.value != null) {
        const shadowValue: ArrayValue = xField.value as ArrayValue

        shadowValue[index] = setValue

        xField.value = shadowValue
      }
    })
  })
}
