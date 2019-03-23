import deepmerge from 'deepmerge'
import flatten from 'flat'
import { isArray, isEqual } from 'lodash'
import { IFieldProps, IXFieldProps } from '../models'
import {
  IObjectValue,
  IXFieldMap,
  IXFieldRefMap,
  OnObjectValueChange,
  OnObjectValueDelete,
  RegisterExtraProps,
} from '../types'
import { fieldsToXFields } from './fieldsToXFields'
import { getValueProxyHandler } from './valueProxyHandler'
import { enhanceXFieldWithDependencies } from './xFieldDependencies'
import { xFieldErrorMessage } from './xFieldErrorMessage'
import { enhanceXFieldWithObjectValues } from './xFieldObjectValues'
import { xFieldsToRefMap } from './xFieldsToRefMap'

export interface IInitXFields<E> {
  fields?: IFieldProps[]
  registerExtraProps?: RegisterExtraProps<E>
  xFieldMap: IXFieldMap<E>
}

export const initXFields = <E>({
  fields = [],
  registerExtraProps,
  xFieldMap,
}: IInitXFields<E>) => {
  const xFields = fieldsToXFields<E>({
    fields,
    registerExtraProps,
    xFieldMap,
  })

  return xFields
}

export interface IInitXFieldMap<E> {
  applicantMaps?: IXFieldMap<E> | Array<IXFieldMap<E>>
  xFieldCoreMap: IXFieldMap<E>
}

export function initXFieldMap<E>({
  applicantMaps,
  xFieldCoreMap,
}: IInitXFieldMap<E>) {
  const applicants = applicantMaps
    ? isArray(applicantMaps)
      ? applicantMaps
      : [applicantMaps]
    : []

  const coreMaps: Array<IXFieldMap<E>> = [xFieldCoreMap]
  const maps = coreMaps.concat(applicants)

  let xFieldMap = {}

  maps.forEach(applicantMap => {
    Object.keys(applicantMap).forEach(key => {
      const xField = applicantMap[key]

      if (xField.type === key) {
        xFieldMap = deepmerge(
          registerXField<E>({ xField, xFieldMap }),
          xFieldMap
        )
      } else {
        xFieldErrorMessage(
          key,
          `because the xField key <${key}> did not match the xField type <${
            xField.type
          }>`
        )
      }
    })
  })

  return xFieldMap
}

export interface IRegisterXField<E> {
  xField: IXFieldProps<E>
  xFieldMap: IXFieldMap<E>
}

export function registerXField<E>({
  xField,
  xFieldMap,
}: IRegisterXField<E>): IXFieldMap<E> {
  if (xField.type && xField.valueType && !xFieldMap[xField.type]) {
    // Straight up register where xField
    xFieldMap[xField.type] = xField
  } else if (xField.type && xField.valueType && xFieldMap[xField.type]) {
    // Register already existing xField by deepmerging
    xFieldMap[xField.type] = deepmerge(xFieldMap[xField.type], xField)
  } else {
    let errorMessage = 'because something went wrong'
    if (!xField.type) {
      errorMessage = 'because the xField it is missing the property "type"'
    } else if (xField.type && xFieldMap[xField.type]) {
      errorMessage = 'since the xtype already exists'
    } else if (!xField.valueType) {
      errorMessage = 'because it is missing the property "valueType"'
    }

    xFieldErrorMessage(xField.type, errorMessage)
  }

  return xFieldMap
}

export function initXFieldRefMap<E>(xFields: Array<IXFieldProps<E>>) {
  const xFieldRefMap = xFieldsToRefMap<E>(xFields)

  return xFieldRefMap
}

export interface IInitXFieldDependencies<E> {
  xField: IXFieldProps<E>
  xFieldRefMap: IXFieldRefMap<E>
}

export function initXFieldDependencies<E>(xFieldRefMap: IXFieldRefMap<E>) {
  Object.keys(xFieldRefMap).forEach(key => {
    const xField = xFieldRefMap[key]

    if (xField.dependencies) {
      enhanceXFieldWithDependencies<E>(xField, xFieldRefMap)
    }
  })
}

export function initXFieldObjectCapability<E>(xFieldRefMap: IXFieldRefMap<E>) {
  // Keys are first sorted by length with shortest first, in order to ensure
  // that we go parent -> child when we have dot notation at play for object
  // enveloped fields
  Object.keys(xFieldRefMap)
    .sort((a, b) => b.length - a.length)
    .forEach(key => {
      const xField = xFieldRefMap[key]

      if (xField.valueType === 'object') {
        enhanceXFieldWithObjectValues<E>(xField)
      }
    })
}

export interface IInitValueProps<E> {
  initialValue?: IObjectValue
  xFieldRefMap: IXFieldRefMap<E>
  onChange: OnObjectValueChange
  onDelete: OnObjectValueDelete
}

export function initValue<E>({
  initialValue,
  xFieldRefMap,
  onChange,
  onDelete,
}: IInitValueProps<E>): IObjectValue {
  let valueRefMap: IObjectValue = {}

  // @TODO - IF no initialValue provided, then go though
  // xFieldRefMap and look for values to populate with
  if (initialValue) {
    valueRefMap = flatten(initialValue)

    Object.keys(valueRefMap).forEach(key => {
      const xField = xFieldRefMap[key]

      if (!xField) {
        // No xField match - rinse off the key in the value ref map
        delete valueRefMap[key]
      } else if (!isEqual(xField.value, valueRefMap[key])) {
        // XField found and values are not equal - set this
        // value on the xField as the initial value
        xField.value = valueRefMap[key]
      }
    })

    Object.keys(xFieldRefMap).forEach(key => {
      const xField = xFieldRefMap[key]

      // Remove xField value if not in the initial values
      // since passed initial values (here valueRefMap) has
      // superiority over definition values (to be considered
      // default values really)
      if (valueRefMap[xField.$id!] === undefined) {
        xField.value = undefined
      }
    })
  }

  const handler = getValueProxyHandler(onChange, onDelete)

  valueRefMap = new Proxy(valueRefMap, handler)

  // With the proxy object now in place we attach a listener to
  // each of the xFields in xFieldRefMap for fast $id/key lookup
  // and comparison
  Object.keys(xFieldRefMap).forEach(key => {
    const xFieldRef = xFieldRefMap[key]

    if (xFieldRef.addListener) {
      xFieldRef.addListener(({ propName, value, xField }) => {
        if (propName === 'value') {
          if (value === undefined) {
            delete valueRefMap[xField.$id!]
          } else {
            valueRefMap[xField.$id!] = value
          }
        }
      })
    }
  })

  return valueRefMap
}
