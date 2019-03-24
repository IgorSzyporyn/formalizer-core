import {
  isArray,
  isBoolean,
  isEmpty,
  isNumber,
  isPlainObject,
  isString,
} from 'lodash'
import { IObjectValue, IXFieldProps, ValueTypes } from '../types'
import { errorMsg } from './messages'

export function stringToValue(stringValue?: string): ValueTypes {
  let value: ValueTypes = stringValue === null ? null : undefined

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

  if (typeof value !== 'string' && value !== null) {
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
      if (!isString(value)) {
        // Any value can become a string
        value = valueToString(value)

        if (value === '') {
          value = undefined
        }

        // We can't safely convert this value - set back to original and
        // display an error message
        if (!isString(value) && value != null) {
          value = setValue
          errorMsg(
            `Tried to convert ${value} as string on xField: ${xField.$id}`
          )
        }
      } else if (value === '') {
        value = undefined
      }
      break
    case 'number':
      if (!isNumber(value)) {
        // We only try to convert from string
        if (isString(value)) {
          value = stringToValue(value)
        }

        if (value === '') {
          value = undefined
        }

        // We can't safely convert this value - set back to original and
        // display an error message
        if (!isNumber(value) && value != null) {
          value = setValue
          errorMsg(
            `Tried to convert ${value} as number on xField: ${xField.$id}`
          )
        }
      }
      break
    case 'boolean':
      if (!isBoolean(value)) {
        if (isString(value)) {
          value = stringToValue(value)
        }

        if (isNumber(value)) {
          value = value > 0 ? true : false
        }

        // We can't safely convert this value - set back to original and
        // display an error message
        if (!isBoolean(value) && value != null) {
          value = setValue
          errorMsg(
            // tslint:disable-next-line max-line-length
            `Tried to convert ${value} as boolean on xField: ${xField.$id}`
          )
        }
      }
      break
    case 'object':
      if (!isPlainObject(value)) {
        // We only try to convert from string
        if (isString(value)) {
          value = stringToValue(value)
        }

        // We can't safely convert this value - set back to original and
        // display an error message
        if (!isPlainObject(value) && value != null) {
          value = setValue
          errorMsg(
            `Tried to convert ${value} as object on xField: ${xField.$id}`
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

      if (isPlainObject(value) && isEmpty(value)) {
        value = undefined
      }
      break
    case 'array':
      if (!isArray(value)) {
        // We only try to convert from string
        if (isString(value)) {
          value = stringToValue(value)
        }

        // We can't safely convert this value - set back to original and
        // display an error message
        if (!isArray(value) && value != null) {
          value = setValue
          errorMsg(
            `Tried to convert ${value} as array on xField: ${xField.$id}`
          )
        }
      }

      if (isArray(value) && isEmpty(value)) {
        value = undefined
      }
      break
    default:
      break
  }

  if (value === undefined && xField.nullable) {
    value = null
  }

  return value
}
