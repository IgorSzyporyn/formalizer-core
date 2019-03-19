import isBoolean from 'lodash/isBoolean'
import isString from 'lodash/isString'
import isNumber from 'lodash/isNumber'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import { ValueTypes } from '../types'
import { errorMsg } from './messages'
import { XFieldProps } from '../models'
import { isEmpty } from 'lodash-es'

export function stringToValue(stringValue?: string): ValueTypes {
  let value

  if (stringValue) {
    try {
      value = JSON.parse(stringValue)
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

        if (!isString(value) && value !== undefined) {
          value = setValue
          errorMsg(
            `Tried to set non convertable value as string on xField: ${
              xField.$id
            }`
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

        // If value is undefined we make a check for an emptyValue and set,
        // since emptyValue is undefined if not specifically set, we can
        // use it as a safe fallback
        if (value === undefined) {
          value = emptyValue
        }

        // If this conversion did not yield a number
        // then fall back to original
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

        // If this conversion did not yield a boolean
        // then fall back to original
        if (!isBoolean(value) && value !== undefined) {
          value = setValue
          errorMsg(
            `Tried to set non convertable value as boolean on xField: ${
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

        // If this conversion did not yield an object
        // then fall back to original
        if (!isObject(value) && value !== undefined) {
          value = setValue
          errorMsg(
            `Tried to set non convertable value as object on xField: ${
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

        // If this conversion did not yield an object
        // then fall back to original
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
