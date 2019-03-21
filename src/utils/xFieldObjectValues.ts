import { isEmpty } from 'lodash'
import { IXFieldProps } from '../models'
import { IObjectValue } from '../types'

export function enhanceXFieldWithObjectValues<E>(xField: IXFieldProps<E>) {
  if (xField.valueType === 'object') {
    // Check if value is set - if not initialize it as an empty array
    if (!xField.value) {
      xField.value = {}
    }

    // Run through each child field in the xField to build the key value
    // store in our value object
    // But do not set keys that has undefined values
    if (xField.fields) {
      xField.fields.forEach(field => {
        if (field.name && field.value !== undefined) {
          xField.value = {
            ...(xField.value as IObjectValue),
            [field.name]: field.value,
          }
        }
        // For test

        // Make sure we listen in on the childs value changes as
        // we need to update the key value in our xField value object
        if (field.addListener) {
          field.addListener(({ propName, value }) => {
            let objectValue = xField.value as IObjectValue

            if (propName === 'value' && field.name) {
              // If our parent value is undefined and we have a value to set
              // we have to initialize objectValue as empty object
              if (objectValue === undefined && value !== undefined) {
                objectValue = (xField.emptyValue as IObjectValue) || {}
              }

              if (value !== undefined) {
                // For object mergeability we do not add undefined keys
                // to our xField value object
                objectValue = {
                  ...objectValue,
                  [field.name]: value,
                }
              } else if (
                objectValue !== undefined &&
                objectValue[field.name] !== undefined
              ) {
                // Likewise we remember to rinse off again if we are
                // encountering a undefined value set on the child
                delete objectValue[field.name]
              }

              xField.value = objectValue
            }
          })
        }
      })
    }

    // If object is still empty then set to xFields emptyValue, which is by
    // default undefined if not set
    if (isEmpty(xField.value)) {
      xField.value = xField.emptyValue
    }
  }
}
