import { XFieldAddListener } from '../types'
import { IFieldProps } from './field'
import { XValueTypes } from './xvalue'

type FieldPropPicks = Pick<
  IFieldProps,
  Exclude<keyof IFieldProps, 'name' | 'fields'>
>

export type XFieldProps<ExtraProps = {}> = FieldPropPicks & {
  name?: string
  valueType: XValueTypes
  fields?: Array<XFieldProps<ExtraProps>>
  extraProps: ExtraProps

  // Internally used props
  $id?: string
  addListener?: XFieldAddListener<ExtraProps>
}
