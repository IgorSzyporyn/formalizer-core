import {
  IObjectValue,
  OnObjectValueChange,
  OnObjectValueDelete,
  ValueTypes,
} from '../types'

export function getValueProxyHandler(
  onChange?: OnObjectValueChange,
  onDelete?: OnObjectValueDelete
) {
  return {
    set(valueRefMap: IObjectValue, propName: string, setValue: ValueTypes) {
      const value = setValue

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
