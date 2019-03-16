import { FieldDependencies, ValueTypes } from '../types'

export interface FieldProps {
  type: string
  name: string
  value?: ValueTypes
  fields?: FieldProps[]
  dependencies?: FieldDependencies[]
  disabled?: boolean
  label?: string
}
