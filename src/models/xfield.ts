import { ValueTypes, XFieldAddListener } from '../types'
import { IFieldProps } from './field'
import { XValueTypes } from './xvalue'

export interface IFieldPropPicks
  extends Pick<IFieldProps, Exclude<keyof IFieldProps, 'name' | 'fields'>> {}

export interface IXFieldProps<ExtraProps = {}> extends IFieldPropPicks {
  name?: string
  valueType: XValueTypes
  fields?: Array<IXFieldProps<ExtraProps>>
  extraProps: ExtraProps
  dirty?: boolean
  touched?: boolean
  initialValue?: ValueTypes

  // Internally used props
  $id?: string
  addListener?: XFieldAddListener<ExtraProps>
}
