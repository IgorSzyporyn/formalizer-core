import {
  isArray,
  isBoolean,
  isEmpty,
  isNumber,
  isObject,
  isString,
} from 'lodash'
import { XFieldProps } from '../models'
import { IObjectValue, ValueTypes } from '../types'
import { errorMsg } from './messages'

//
export function stringToValue(stringValue?: string): ValueTypes {
  let value

  if (stringValue) {
    try {
      value = JSON.parse(stringValue)
      // tslint:disable-next-line no-empty
    } catch (e) {}
  }

  if (value === undefined && stringValue) {
    value = stringValue
  }

  return value
}

export function valueToString(value: ValueTypes) {
  let stringValue

  if (typeof value !== 'string') {
    try {
      stringValue = JSON.stringify(value)
      // tslint:disable-next-line no-empty
    } catch (e) {}
  } else {
    stringValue = value
  }

  return stringValue
}

export function sanitizeValue<ExtraProps = {}>(
  xField: XFieldProps<ExtraProps>,
  setValue: any
) {
  const { emptyValue } = xField
  let value = setValue

  switch (xField.valueType) {
    case 'string':
      if (!isString(setValue)) {
        // Any value can become a string
        value = valueToString(setValue)

        if (value === '') {
          value = undefined
        }

        // If value is undefined we make a check for an emptyValue and set,
        // since emptyValue is undefined if not specifically set, we can
        // use it as a safe fallback
        if (value === undefined) {
          value = emptyValue
        }

        // We can't safely convert this value - set back to original and
        // display an error message
        if (!isString(value) && value !== undefined) {
          value = setValue
          errorMsg(
            `Tried to set non convertable value as string on xField: ${
              xField.$id
            }`
          )
        }
      } else if (setValue === '') {
        value = emptyValue
      }
      break
    case 'number':
      if (!isNumber(setValue)) {
        // We only try to convert from string
        if (isString(setValue)) {
          value = stringToValue(setValue)
        }

        if (value === '') {
          value = undefined
        }

        // If value is undefined we make a check for an emptyValue and set,
        // since emptyValue is undefined if not specifically set, we can
        // use it as a safe fallback
        if (value === undefined) {
          value = emptyValue
        }

        // We can't safely convert this value - set back to original and
        // display an error message
        if (!isNumber(value) && value !== undefined) {
          value = setValue
          errorMsg(
            `Tried to set non convertable value as number on xField: ${
              xField.$id
            }`
          )
        }
      }
      break
    case 'boolean':
      if (!isBoolean(setValue)) {
        if (isString(setValue)) {
          value = stringToValue(setValue)
        }

        if (isNumber(setValue)) {
          value = setValue > 0 ? true : false
        }

        // If value is undefined we make a check for an emptyValue and set,
        // since emptyValue is undefined if not specifically set, we can
        // use it as a safe fallback
        if (value === undefined) {
          value = emptyValue
        }

        // We can't safely convert this value - set back to original and
        // display an error message
        if (!isBoolean(value) && value !== undefined) {
          value = setValue
          errorMsg(
            `Tried to set non convertable value ${value} as boolean on xField: ${
              xField.$id
            }`
          )
        }
      }
      break
    case 'object':
      if (!isObject(setValue)) {
        // We only try to convert from string
        if (isString(setValue)) {
          value = stringToValue(setValue)
        }

        // If value is undefined we make a check for an emptyValue and set,
        // since emptyValue is undefined if not specifically set, we can
        // use it as a safe fallback
        if (value === undefined) {
          value = emptyValue
        }

        // We can't safely convert this value - set back to original and
        // display an error message
        if (!isObject(value) && value !== undefined) {
          value = setValue
          errorMsg(
            `Tried to set non convertable value as object on xField: ${
              xField.$id
            }`
          )
        }
      }

      // Populated value object will need to have its potential children
      // examined and gone through recursivly through fields, and have
      // those values sanitized and brought back up
      if (xField.fields) {
        value = value || {}

        xField.fields.forEach(childField => {
          if (childField.name) {
            const parentsChildValue = value[childField.name] as IObjectValue
            const childValue = sanitizeValue(childField, parentsChildValue)

            if (childValue !== undefined) {
              value[childField.name] = childValue
            } else {
              delete value[childField.name]
            }
          }
        })
      }

      if (isObject(value) && isEmpty(value)) {
        value = emptyValue
      }
      break
    case 'array':
      if (!isArray(setValue)) {
        // We only try to convert from string
        if (isString(setValue)) {
          value = stringToValue(setValue)
        }

        // If value is undefined we make a check for an emptyValue and set,
        // since emptyValue is undefined if not specifically set, we can
        // use it as a safe fallback
        if (value === undefined) {
          value = emptyValue
        }

        // We can't safely convert this value - set back to original and
        // display an error message
        if (!isArray(value) && value !== undefined) {
          value = setValue
          errorMsg(
            `Tried to set non convertable value as array on xField: ${
              xField.$id
            }`
          )
        }
      } else {
        if (isEmpty(value)) {
          value = emptyValue
        }
      }
      break
    default:
      break
  }

  return value
}
