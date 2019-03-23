import {
  isArray,
  isBoolean,
  isEmpty,
  isNumber,
  isObject,
  isString,
} from 'lodash'
import { IXFieldProps } from '../models'
import { IObjectValue, ValueTypes } from '../types'
import { errorMsg } from './messages'

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
  xField: IXFieldProps<ExtraProps>,
  setValue: any
) {
  let value = setValue

  switch (xField.valueType) {
    case 'string':
      if (!isString(setValue)) {
        // Any value can become a string
        value = valueToString(setValue)

        if (value === '') {
          value = undefined
        }

        // We can't safely convert this value - set back to original and
        // display an error message
        if (!isString(value) && value !== undefined) {
          value = setValue
          errorMsg(
            `Tried to convert ${value} as string on xField: ${xField.$id}`
          )
        }
      } else if (setValue === '') {
        value = undefined
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

        // We can't safely convert this value - set back to original and
        // display an error message
        if (!isNumber(value) && value !== undefined) {
          value = setValue
          errorMsg(
            `Tried to convert ${value} as number on xField: ${xField.$id}`
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

        // We can't safely convert this value - set back to original and
        // display an error message
        if (!isBoolean(value) && value !== undefined) {
          value = setValue
          errorMsg(
            // tslint:disable-next-line max-line-length
            `Tried to convert ${value} as boolean on xField: ${xField.$id}`
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

        // We can't safely convert this value - set back to original and
        // display an error message
        if (!isObject(value) && value !== undefined) {
          value = setValue
          errorMsg(
            `Tried to convert ${value} as as object on xField: ${xField.$id}`
          )
        }
      }

      // Populated value object will need to have its potential children
      // examined and gone through recursivly through fields, and have
      // those values sanitized and brought back up
      // @TODO - Examine what happens here - proxy it out probably to function
      // which will also be used in file:xFieldObjectValues.ts
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
        value = undefined
      }
      break
    case 'array':
      if (!isArray(setValue)) {
        // We only try to convert from string
        if (isString(setValue)) {
          value = stringToValue(setValue)
        }

        // We can't safely convert this value - set back to original and
        // display an error message
        if (!isArray(value) && value !== undefined) {
          value = setValue
          errorMsg(
            `Tried to convert ${value} as array on xField: ${xField.$id}`
          )
        }
      }
      break
    default:
      break
  }

  return value
}
