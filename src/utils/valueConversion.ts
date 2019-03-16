import { ValueTypes } from '../types'

export function stringToValue(stringValue?: string): ValueTypes {
  let value

  if (stringValue) {
    try {
      value = JSON.parse(stringValue)
    } catch (e) {}
  }

  if (!value && stringValue) {
    value = stringValue
  }

  return value
}

export function valueToString(value: ValueTypes) {
  let stringValue

  if (typeof value !== 'string') {
    try {
      stringValue = JSON.stringify(value)
    } catch (e) {}
  } else {
    stringValue = value
  }

  return stringValue
}
