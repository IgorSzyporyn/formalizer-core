import deepmerge from 'deepmerge'
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
  // First set initialValues on first level xFields
  if (initialValue) {
    Object.keys(xFieldRefMap).forEach(key => {
      const xField = xFieldRefMap[key]
      const isObjectChild = xField.$id!.includes('.')

      if (!isObjectChild) {
        xField.value =
          initialValue[key] !== undefined ? initialValue[key] : undefined
      }
    })
  }

  let valueMap: IObjectValue = {}

  // Do a run through the xFieldRefMap and build the valueMap
  Object.keys(xFieldRefMap).forEach(key => {
    const xField = xFieldRefMap[key]
    const isObjectChild = xField.$id!.includes('.')

    if (!isObjectChild && xField.value !== undefined) {
      valueMap[xField.name!] = xField.value
    }
  })

  const handler = getValueProxyHandler(onChange, onDelete)

  valueMap = new Proxy(valueMap, handler)

  // Do a final run through the xFieldRefMap and attach listeners
  // to keep valueRepMap updated now it is a proxy
  Object.keys(xFieldRefMap).forEach(key => {
    const xField = xFieldRefMap[key]
    const isObjectChild = xField.$id!.includes('.')

    if (!isObjectChild) {
      xField.addListener!(({ propName, value }) => {
        if (propName === 'value' && value === undefined) {
          delete valueMap[key]
        } else if (propName === 'value' && value !== undefined) {
          valueMap[key] = value
        }
      })
    }
  })

  return valueMap
}

export function initXFieldStateHandlers<E>(xFieldRefMap: IXFieldRefMap<E>) {
  xFieldRefMapEach<E>(xFieldRefMap, xField => {
    xField.initialValue = xField.value

    xField.addListener!(({ propName, value }) => {
      if (propName === 'value') {
        xField.dirty = !isEqual(value, xField.initialValue)

        if (xField.dirty) {
          xField.touched = true
        }
      }
    })
  })
}

export type XFieldRefMapEachFn<E> = (xField: IXFieldProps<E>) => void

export function xFieldRefMapEach<E>(
  xFieldRefMap: IXFieldRefMap<E>,
  fn: XFieldRefMapEachFn<E>
) {
  Object.keys(xFieldRefMap).forEach(key => {
    const xField = xFieldRefMap[key]
    fn(xField)
  })
}
