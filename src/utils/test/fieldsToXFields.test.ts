import { fieldsToXFields, fieldToXField } from '../fieldsToXFields'
import { IXFieldMap } from '../../types';
import { IFieldProps, XFieldProps } from '../../models';

const config: {
  fields: IFieldProps[]
  xFieldMap: IXFieldMap
  xFields: XFieldProps[]
} = {
  xFieldMap: {
    text: {
      type: 'text',
      valueType: 'string',
      extraProps: {}
    }
  },
  fields: [
    { type: 'text', name: 'a', fields: [{ type: 'text', name: 'd'}]},
    { type: 'text', name: 'b'},
    { type: 'text', name: 'c'}
  ],
  xFields: []
}

describe('fieldsToXFields = ({ fields: FieldProps[], ...}) => XFieldProps[]', () => {
  
  test('should return array with 3 items when converting 3 fields', () => {
    expect(fieldsToXFields({fields: config.fields, xFieldMap: config.xFieldMap})).toHaveLength(3)
  })

  test.each(['$id', 'valueType', 'addListener'])(
    `a converted field array item should have the property %s`,
    (a) => {
      expect(fieldsToXFields({fields: config.fields, xFieldMap: config.xFieldMap})[0]).toHaveProperty(a)
  })

  test.each(['$id', 'valueType', 'addListener'])(
    `a converted field array item nested in another item should have the property %s`,
    (a) => {
      expect(fieldsToXFields({fields: config.fields, xFieldMap: config.xFieldMap})[0].fields![0]).toHaveProperty(a)
  })
})

describe('fieldToXField = ({ field: FieldProps, ...}) => XFieldProps', () => {
  test.each(['$id', 'valueType', 'addListener'])(
    `a converted field should have the property %s`,
    (a) => {
      expect(fieldToXField({field: config.fields[0], xFieldMap: config.xFieldMap})).toHaveProperty(a)
  })
})

