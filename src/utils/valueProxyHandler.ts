import { isArray } from 'lodash'
import {
  IObjectValue,
  OnObjectValueChange,
  OnObjectValueDelete,
  ValueTypes,
} from '../types'

function sanitizeArray(inputArray: ValueTypes[]) {
  const returnArray: ValueTypes[] = []

  inputArray.forEach(item => {
    if (item !== undefined) {
      returnArray.push(item)
    } else if (isArray(item)) {
      const result = sanitizeArray(item)
      if (result !== undefined) {
        returnArray.push(item)
      }
    }
  })

  return returnArray
}

export function getValueProxyHandler(
  onChange?: OnObjectValueChange,
  onDelete?: OnObjectValueDelete
) {
  return {
    set(valueRefMap: IObjectValue, propName: string, setValue: ValueTypes) {
      let value = setValue

      // Arrays needs to have their undefined rinsed off - undefined are
      // left in place till this point because index is used as reference
      // and it needs to be done recursivly
      if (isArray(value)) {
        value = sanitizeArray(value)
      }

      valueRefMap[propName] = value

      if (onChange) {
        onChange({ propName, value, valueRefMap })
      }

      return true
    },
    deleteProperty: (valueRefMap: IObjectValue, propName: string) => {
      const value = valueRefMap[propName]
      delete valueRefMap[propName]

      if (onDelete) {
        onDelete({ propName, value, valueRefMap })
      }

      return true
    },
  }
}
