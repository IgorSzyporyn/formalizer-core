import { IFieldDependency, ValueTypes } from '../types'

export interface IFieldProps<ExtraProps = {}> {
  type: string
  name: string
  value?: ValueTypes
  emptyValue?: ValueTypes
  defaultValue?: ValueTypes
  fields?: Array<IFieldProps<ExtraProps>>
  dependencies?: IFieldDependency[]
  title?: string
  description?: string
  disabled?: boolean
  nullable?: boolean
  extraProps?: ExtraProps
}
