import { XFieldProps } from './xfield'

export interface XFieldMap<ExtraProps = {}> {
  [key: string]: XFieldProps<ExtraProps>
}

export function xFieldMap<ExtraProps>() {
  const xFieldMap: XFieldMap<ExtraProps> = {
    text: {
      type: 'text',
      valueType: 'string',
    },
    number: {
      type: 'number',
      valueType: 'number',
    },
    email: {
      type: 'email',
      valueType: 'string',
    },
  }

  return xFieldMap
}
