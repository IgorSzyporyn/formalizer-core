import { FieldProps, XFieldProps } from '../models'
import { warningMsg } from './messages'
import { enhanceXFieldWithListener } from './xFieldListener'
import { RegisterExtraProps, XFieldMap } from '../types'
import deepmerge from 'deepmerge'

export function fieldToXField<ExtraProps = {}>({
  field,
  xFieldMap,
  registerExtraProps,
  parent,
}: {
  field: FieldProps
  xFieldMap: XFieldMap<ExtraProps>
  registerExtraProps?: RegisterExtraProps<ExtraProps>
  parent?: XFieldProps<ExtraProps>
}): XFieldProps<ExtraProps> {
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
    xFieldMap[parent.type].valueType === 'object'
  ) {
    $id = `${parent.$id || parent.name}.${field.name}`
  }

  // Merge with the xFieldMap model and add the created $id
  let xField: XFieldProps<ExtraProps> = {
    ...xFieldMap[field.type],
    ...fieldProps,
    $id,
  }

  if (xField.value === undefined && xField.emptyValue !== undefined) {
    xField.value = xField.emptyValue
  }

  // If a registerExtraProps function was sent along then we
  // need to give that a chance to return some additional
  // extraProps to extend with
  if (registerExtraProps) {
    const extraProps = registerExtraProps(xField)

    xField = {
      ...xField,
      extraProps: deepmerge(extraProps, xField.extraProps),
    }
  }

  // Empower xField with the ability for added
  // listeners looking for a callback on xField
  // property changes
  xField = enhanceXFieldWithListener<ExtraProps>(xField)

  xField.addListener!(() => {
    // Run formalizer listener
  })

  // Look for child fields that also needs to be converted
  if (field.fields) {
    const xFields = fieldsToXFields<ExtraProps>({
      fields: field.fields,
      xFieldMap,
      registerExtraProps,
      parent: xField,
    })

    if (xFields) {
      xField.fields = xFields
    }
  }

  return xField
}

export function fieldsToXFields<ExtraProps = {}>({
  fields,
  xFieldMap,
  registerExtraProps,
  parent,
}: {
  fields: FieldProps[]
  xFieldMap: XFieldMap<ExtraProps>
  registerExtraProps?: RegisterExtraProps<ExtraProps>
  parent?: XFieldProps<ExtraProps>
}): XFieldProps<ExtraProps>[] {
  return fields
    .map(field =>
      fieldToXField<ExtraProps>({
        field,
        xFieldMap,
        registerExtraProps,
        parent,
      })
    )
    .filter(f => f)
}
