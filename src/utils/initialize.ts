import deepmerge from 'deepmerge'
import { isArray, isEqual } from 'lodash'
import {
  IFieldProps,
  IValue,
  IXFieldMap,
  IXFieldProps,
  IXFieldRefMap,
  OnObjectValueChange,
  OnObjectValueDelete,
  RegisterExtraProps,
} from '../types'
import { fieldsToXFields } from './fieldsToXFields'
import { mapEach } from './mapEach'
import { getValueProxyHandler } from './valueProxyHandler'
import { enhanceXFieldWithArrayValues } from './xFieldArrayValues'
import { enhanceXFieldWithDependencies } from './xFieldDependencies'
import { xFieldErrorMessage } from './xFieldErrorMessage'
import { enhanceXFieldWithObjectValues } from './xFieldObjectValues'
import { xFieldsToRefMap } from './xFieldsToRefMap'

export interface IInitXFields<E> {
  fields?: Array<IFieldProps<E>>
  registerExtraProps?: RegisterExtraProps<E>
  xFieldMap: IXFieldMap<E>
}

export function initXFields<E>({
  fields = [],
  registerExtraProps,
  xFieldMap,
}: IInitXFields<E>) {
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

  let xFieldMap: IXFieldMap<E> = {}

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

/**
 * Initialize the required functionality to handle fields that has dependencies
 * by filtering those fields out and run them through the
 * `enhanceXFieldWithDependencies` function
 *
 */
export function initXFieldDependencies<E>(xFieldRefMap: IXFieldRefMap<E>) {
  mapEach<IXFieldRefMap<E>, IXFieldProps<E>>(xFieldRefMap, xField => {
    if (xField.dependencies) {
      enhanceXFieldWithDependencies<E>(xField, xFieldRefMap)
    }
  })
}

/**
 * Initialize the required functionality to handle fields with object values
 * by filtering out those fields with valueType of `object` and run through
 * the `enhanceXFieldWithObjectValues` function
 *
 */
export function initXFieldObjectCapability(xFieldRefMap: IXFieldRefMap) {
  // Keys are first sorted by length with shortest first, in order to ensure
  // that we go parent -> child when we have dot notation at play for object
  // enveloped fields
  Object.keys(xFieldRefMap)
    .sort((a, b) => b.length - a.length)
    .forEach(key => {
      const xField = xFieldRefMap[key]

      if (xField.valueType === 'object') {
        enhanceXFieldWithObjectValues(xField)
      }
    })
}

/**
 * Initialize the required functionality to handle fields with array values
 * by filtering out those fields with valueType of `array` and run through
 * the `enhanceXFieldWithArrayValues` function
 *
 */
export function initXFieldArrayCapability(xFieldRefMap: IXFieldRefMap) {
  mapEach<IXFieldRefMap, IXFieldProps>(xFieldRefMap, xField => {
    if (xField.valueType === 'array') {
      enhanceXFieldWithArrayValues(xField)
    }
  })
}

export interface IInitValueProps {
  value?: IValue
  xFieldRefMap: IXFieldRefMap
  onChange: OnObjectValueChange
  onDelete: OnObjectValueDelete
}

/**
 * Initialize the value for Formalizer instance and the fields
 * using a given value from options as initial value.
 *
 * Will also initialize the update of the Formalizer value in case
 * any field value changes.
 *
 */
export function initValue({
  value,
  xFieldRefMap,
  onChange,
  onDelete,
}: IInitValueProps): IValue {
  // First set values on first level xFields
  if (value) {
    Object.keys(xFieldRefMap).forEach(key => {
      const xField = xFieldRefMap[key]
      const isObjectChild = xField.$id!.includes('.')

      if (!isObjectChild) {
        xField.value = value[key] !== undefined ? value[key] : undefined
      }
    })
  }

  let valueMap: IValue = {}

  // Do a run through the xFieldRefMap and build the valueMap
  mapEach<IXFieldRefMap, IXFieldProps>(xFieldRefMap, (xField, key) => {
    const isObjectChild = key.includes('.')

    if (!isObjectChild && xField.value !== undefined) {
      valueMap[xField.name!] = xField.value
    }
  })

  const handler = getValueProxyHandler(onChange, onDelete)

  valueMap = new Proxy(valueMap, handler)

  // Do a final run through the xFieldRefMap and attach listeners
  // to keep valueRepMap updated now it is a proxy
  mapEach<IXFieldRefMap, IXFieldProps>(xFieldRefMap, (xField, key) => {
    const isObjectChild = xField.$id!.includes('.')

    if (!isObjectChild) {
      xField.addListener!(state => {
        if (state.propName === 'value' && state.value === undefined) {
          delete valueMap[key]
        } else if (state.propName === 'value' && state.value !== undefined) {
          valueMap[key] = state.value
        }
      })
    }
  })

  return valueMap
}

/**
 * Initialize the handling of each fields state (dirty, touched etc..)
 *
 */
export function initXFieldStateHandlers(xFieldRefMap: IXFieldRefMap) {
  mapEach<IXFieldRefMap, IXFieldProps>(xFieldRefMap, xField => {
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
