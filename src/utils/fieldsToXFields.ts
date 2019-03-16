import { FieldProps, XFieldMap, XFieldProps } from '../models'
import { registerXTypeError } from './registerXTypeError'
import { enhanceXFieldWithListener } from './xFieldListener'
import { RegisterExtraProps } from '../types'

interface FieldToXField<ExtraProps> {
  field: FieldProps
  xFieldMap: XFieldMap<ExtraProps>
  registerExtraProps?: RegisterExtraProps<ExtraProps>
  parent?: XFieldProps<ExtraProps>
}

function fieldToXField<ExtraProps = {}>({
  field,
  xFieldMap,
  registerExtraProps,
  parent,
}: FieldToXField<ExtraProps>): XFieldProps<ExtraProps> {
  if (!xFieldMap[field.type]) {
    registerXTypeError(field.type, 'because xType could not be found')
  }

  // Get rid of fields as the types are incompatible
  const { fields, ...fieldProps } = field

  const xFieldProto = xFieldMap[field.type]
  let $id = field.name

  if (parent) {
    const parentXFieldProto = xFieldMap[parent.type]

    if (parentXFieldProto.valueType === 'object') {
      $id = `${parent.$id || parent.name}.${field.name}`
    }
  }

  let xField: XFieldProps<ExtraProps> = {
    ...xFieldProto,
    ...fieldProps,
    $id,
  }

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

  if (registerExtraProps) {
    const extraProps = registerExtraProps(xField)

    xField = {
      ...xField,
      extraProps: {
        ...extraProps,
        ...(xField.extraProps || {}),
      },
    }
  }

  // Empower xField with the ability for added
  // listeners looking for a callback on xField
  // property changes
  xField = enhanceXFieldWithListener<ExtraProps>(xField)

  return xField
}

interface FieldsToXFields<ExtraProps> {
  fields: FieldProps[]
  xFieldMap: XFieldMap<ExtraProps>
  registerExtraProps?: RegisterExtraProps<ExtraProps>
  parent?: XFieldProps<ExtraProps>
}

export function fieldsToXFields<ExtraProps = {}>({
  fields,
  xFieldMap,
  registerExtraProps,
  parent,
}: FieldsToXFields<ExtraProps>): XFieldProps<ExtraProps>[] {
  const xFields = fields
    .map(field => {
      const xTypeField = fieldToXField<ExtraProps>({
        field,
        xFieldMap,
        registerExtraProps,
        parent,
      })

      return xTypeField
    })
    .filter(f => f)

  return xFields
}
