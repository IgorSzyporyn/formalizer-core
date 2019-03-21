import { XFieldAddListener } from '../types'
import { IFieldProps } from './field'
import { XValueTypes } from './xvalue'

export interface IFieldPropPicks
  extends Pick<IFieldProps, Exclude<keyof IFieldProps, 'name' | 'fields'>> {}

export interface IXFieldProps<IExtraProps = {}> extends IFieldPropPicks {
  name?: string
  valueType: XValueTypes
  fields?: Array<IXFieldProps<IExtraProps>>
  extraProps: IExtraProps

  // Internally used props
  $id?: string
  addListener?: XFieldAddListener<IExtraProps>
}
