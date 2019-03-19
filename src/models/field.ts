import { FieldDependencies, ValueTypes } from '../types'

export interface FieldProps {
  type: string
  name: string
  value?: ValueTypes
  emptyValue?: ValueTypes
  fields?: FieldProps[]
  dependencies?: FieldDependencies[]
  title?: string
  subTitle?: string
  description?: string
  disabled?: boolean
}
