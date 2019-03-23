import { isEqual } from 'lodash'
import { IXFieldProps } from '../models'
import { IObjectValue, ValueTypes } from '../types'

export function enhanceXFieldWithObjectValues<E>(xField: IXFieldProps<E>) {
  const fields = xField.fields || []
  const fieldValue = xField.value as IObjectValue

  if (fieldValue === undefined) {
    const shadowValue: IObjectValue = {}

    fields.forEach(childField => {
      if (childField.value != null) {
        shadowValue[childField.name!] = childField.value
      }
    })

    if (fields.length) {
      xField.value = shadowValue
    }
  } else {
    fields.forEach(childField => {
      if (!isEqual(childField.name, fieldValue[childField.name!])) {
        childField.value = fieldValue[childField.name!]
      }
    })
  }

  fields.forEach(childField => {
    childField.addListener!(({ propName, value }) => {
      const setValue: ValueTypes = value

      if (propName === 'value' && xField.value == null) {
        const shadowValue: IObjectValue = {}

        if (setValue !== undefined) {
          shadowValue[childField.name!] = setValue
        }

        xField.value = shadowValue
      } else if (propName === 'value' && xField.value != null) {
        const shadowValue: IObjectValue = xField.value as IObjectValue

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
