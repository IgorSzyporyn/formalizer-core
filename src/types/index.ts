import { FieldProps, XFieldMap, XFieldProps } from '../models'

export interface FormalizerOptions<ExtraProps = {}> {
  fields?: FieldProps[]
  xFieldMap?: XFieldMap<ExtraProps>
  registerExtraProps?: RegisterExtraProps<ExtraProps>
}

export type FormalizerOnChange<ExtraProps = {}> = (
  xField: XFieldProps<ExtraProps>
) => void

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

export interface XFieldsRefMap<ExtraProps = {}> {
  [key: string]: XFieldProps<ExtraProps>
}

export type FieldDependencyDisabledTypes = 'disabled' | 'hidden'

export interface FieldDependencies {
  name: string
  propName: SafeXFieldKeys
  value?: any
  anyOf?: []
  allOf?: []
  noneOf?: []
  disabledType?: FieldDependencyDisabledTypes
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

export type ValueTypes =
  | string
  | number
  | boolean
  | null
  | Object
  | []
  | undefined
