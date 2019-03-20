import {Formalizer} from '../../src/formalizer'
import { fieldToXField, fieldsToXFields } from '../../src/utils/fieldsToXFields'

let formalizer: Formalizer

beforeAll(() => {
  formalizer = new Formalizer({
    fields: [
      { type: 'string', name: 'a', fields: [{ type: 'string', name: 'd'}]},
      { type: 'string', name: 'b'},
      { type: 'string', name: 'c'}
    ]
  })
})

describe(
  'fieldsToXFields = ({ fields: FieldProps[], ...}) => XFieldProps[]',
  () => {
    test('should return array with 3 items when converting 3 fields', () => {
    expect(fieldsToXFields(
      {fields: formalizer.fields, xFieldMap: formalizer.xFieldMap})
    )
      .toHaveLength(3)
  })

  test.each(['$id', 'valueType', 'addListener'])(
    `a converted field array item should have the property %s`,
    (a) => {
      expect(fieldsToXFields(
        {fields: formalizer.fields, xFieldMap: formalizer.xFieldMap})[0]
      )
        .toHaveProperty(a)
  })

  test.each(['$id', 'valueType', 'addListener'])(
    // tslint:disable-next-line max-line-length
    `a converted field array item nested in another item should have the property %s`,
    (a) => {
      expect(fieldsToXFields(
        {
          fields: formalizer.fields,
          xFieldMap: formalizer.xFieldMap
        }
      )[0].fields![0])
        .toHaveProperty(a)
  })
})

describe('fieldToXField = ({ field: FieldProps, ...}) => XFieldProps', () => {
  test.each(['$id', 'valueType', 'addListener'])(
    `a converted field should have the property %s`,
    (a) => {
      expect(fieldToXField(
        {field: formalizer.fields[0], xFieldMap: formalizer.xFieldMap})
      )
        .toHaveProperty(a)
  })
})

