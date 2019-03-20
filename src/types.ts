import { FieldProps, XFieldProps } from './models'

export interface XFieldMap<ExtraProps = {}> {
  [key: string]: XFieldProps<ExtraProps>
}
export interface FormalizerOptions<ExtraProps = {}> {
  fields?: FieldProps[]
  xFieldMap?: XFieldMap<ExtraProps> | XFieldMap<ExtraProps>[]
  registerExtraProps?: RegisterExtraProps<ExtraProps>
  valuesAsString?: boolean
}

export type RegisterExtraProps<ExtraProps> = (
  xField: XFieldProps<ExtraProps>
) => ExtraProps

export type SafeXFieldProps<U = {}> = Pick<
  XFieldProps<U>,
  Exclude<keyof XFieldProps<U>, 'addListener'>
>

export type SafeXFieldKeys<U = {}> = keyof SafeXFieldProps<U>

export type FieldKeys = keyof FieldProps

export type OnXFieldChangeProps<U = {}> = {
  propName: SafeXFieldKeys<U>
  value: any
  xField: XFieldProps<U>
}

export type OnXFieldChange<U = {}> = (props: OnXFieldChangeProps<U>) => void

export interface XFieldRefMap<ExtraProps = {}> {
  [key: string]: XFieldProps<ExtraProps>
}

export interface FieldDependencies {
  name: string
  matchProp: SafeXFieldKeys
  matchValue?: any
  matchAnyOf?: any[]
  matchAllOf?: any[]
  matchNoneOf?: any[]
  targetProp: string
  successValue?: any
  failureValue?: any
}

export type XFieldListenerCallbackProps<ExtraProps = {}> = {
  propName: SafeXFieldKeys<ExtraProps>
  value: any
  xField: XFieldProps<ExtraProps>
}

export type XFieldListenerCallback<ExtraProps = {}> = ({
  propName,
  value,
  xField,
}: XFieldListenerCallbackProps<ExtraProps>) => void

export type XFieldAddListener<ExtraProps = {}> = (
  callback: XFieldListenerCallback<ExtraProps>
) => void

export interface ObjectValue {
  [key: string]: ValueTypes
}

export type ValueTypes =
  | string
  | number
  | boolean
  | ObjectValue
  | any[]
  | undefined
  | null
