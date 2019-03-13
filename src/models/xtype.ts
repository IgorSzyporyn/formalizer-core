export interface XtypeModel {
  type: string
  valueType: 'string' | 'number' | 'boolean' | 'array'
}

export interface XtypeMapModel {
  [key: string]: XtypeModel
}

export const xtypeMap: XtypeMapModel = {
  text: {
    type: 'input',
    valueType: 'string',
  },
}
