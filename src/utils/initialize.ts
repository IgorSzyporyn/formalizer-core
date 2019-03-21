import deepmerge from 'deepmerge'
import { isArray } from 'lodash'
import { IFieldProps, IXFieldProps } from '../models'
import { IXFieldMap, IXFieldRefMap, RegisterExtraProps } from '../types'
import { fieldsToXFields } from './fieldsToXFields'
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
        xFieldMap = {
          ...registerXField<E>({ xField, xFieldMap }),
          ...xFieldMap,
        }
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

interface IRegisterXField<E> {
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

export function initObjectXFields<E>(xFieldRefMap: IXFieldRefMap<E>) {
  Object.keys(xFieldRefMap).forEach(key => {
    const xField = xFieldRefMap[key]

    enhanceXFieldWithObjectValues<E>(xField)
  })
}
