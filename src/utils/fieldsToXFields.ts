import deepmerge from 'deepmerge'
import {
  IFieldProps,
  IXFieldMap,
  IXFieldProps,
  RegisterExtraProps,
} from '../types'
import { warningMsg } from './messages'
import { enhanceXFieldWithListener } from './xFieldListener'

export function fieldToXField<ExtraProps = {}>({
  field,
  xFieldMap,
  registerExtraProps,
  parent,
}: {
  field: IFieldProps<ExtraProps>
  xFieldMap: IXFieldMap<ExtraProps>
  registerExtraProps?: RegisterExtraProps<ExtraProps>
  parent?: IXFieldProps<ExtraProps>
}): IXFieldProps<ExtraProps> {
  if (!xFieldMap[field.type]) {
    warningMsg(
      `Error creating the field "${field.name}" because the field type "${
        field.type
      }" could not be found in the xField type map`
    )
  }

  // Get rid of fields as the types are incompatible between
  // field and xField - use remaining fieldProps to convert
  const { fields, ...fieldProps } = field

  // Ready the internal $id used to keep track of xFields in xFieldRefMap
  let $id = field.name

  // Check for a parent as $id needs to be dot notated if parent
  // valueType is 'object'
  if (
    parent &&
    xFieldMap[parent.type] &&
    (xFieldMap[parent.type].valueType === 'object' ||
      xFieldMap[parent.type].valueType === 'array')
  ) {
    $id = `${parent.$id || parent.name}.${field.name}`
  }

  // Merge with the xFieldMap model and add the created $id
  let xField: IXFieldProps<ExtraProps> = {
    ...xFieldMap[field.type],
    ...fieldProps,
    $id,
  }

  // If a registerExtraProps function was sent along then we
  // need to give that a chance to return some additional
  // extraProps to extend with
  if (registerExtraProps) {
    const extraProps = registerExtraProps(xField)
    xField.extraProps = deepmerge(xField.extraProps, extraProps)
  }

  // Empower xField with the ability for added
  // listeners looking for a callback on xField
  // property changes
  xField = enhanceXFieldWithListener<ExtraProps>(xField)

  // Look for child fields that also needs to be converted
  if (field.fields) {
    const xFields = fieldsToXFields<ExtraProps>({
      fields: field.fields,
      parent: xField,
      registerExtraProps,
      xFieldMap,
    })

    if (xFields) {
      xField.fields = xFields
    }
  }

  // Ensure default value of null if nullable
  if (xField.nullable && xField.value === undefined) {
    xField.value = null
  }

  return xField
}

export function fieldsToXFields<ExtraProps = {}>({
  fields,
  xFieldMap,
  registerExtraProps,
  parent,
}: {
  fields: Array<IFieldProps<ExtraProps>>
  xFieldMap: IXFieldMap<ExtraProps>
  registerExtraProps?: RegisterExtraProps<ExtraProps>
  parent?: IXFieldProps<ExtraProps>
}): Array<IXFieldProps<ExtraProps>> {
  return fields
    .map(field =>
      fieldToXField<ExtraProps>({
        field,
        parent,
        registerExtraProps,
        xFieldMap,
      })
    )
    .filter(f => f)
}
