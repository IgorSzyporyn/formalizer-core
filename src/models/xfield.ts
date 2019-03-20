import { FieldProps } from './field'
import { XValueTypes } from './xvalue'
import { XFieldAddListener } from '../types'

type FieldPropPicks = Pick<
  FieldProps,
  Exclude<keyof FieldProps, 'name' | 'fields'>
>

export type XFieldProps<ExtraProps = {}> = FieldPropPicks & {
  name?: string
  valueType: XValueTypes
  fields?: XFieldProps<ExtraProps>[]
  extraProps: ExtraProps

  // Internally used props
  $id?: string
  addListener?: XFieldAddListener<ExtraProps>
}