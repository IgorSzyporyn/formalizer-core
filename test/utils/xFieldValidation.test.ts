import { IXFieldProps, SafeXFieldProps } from '../../src/types'
import {
  createMessagesFromFields,
  createSchemaFromFields,
  initXFieldValidation,
} from '../../src/utils'

const baseField: SafeXFieldProps = {
  type: 'string',
  name: 'a',
  $id: 'a',
  valueType: 'string',
  extraProps: {},
}

// tslint:disable max-line-length

beforeAll(() => {})

describe('createSchemaFromFields: (fields: XFieldProps[]) => IValidationSchema', () => {
  test('should be able to create empty schema from empty fields array', () => {
    const schema = createSchemaFromFields([])

    expect(schema).toMatchObject({
      type: 'object',
      properties: {},
    })
  })

  test('should be able to create a minimal schema from single minimal field', () => {
    const schema = createSchemaFromFields([
      {
        ...baseField,
        validation: {},
      },
    ])

    expect(schema).toMatchObject({
      type: 'object',
      properties: {
        a: {
          type: 'string',
        },
      },
    })
  })

  test('should be able to create simple schema with 1 required field', () => {
    const schema = createSchemaFromFields([
      {
        ...baseField,
        validation: {
          mandatory: true,
        },
      },
    ])

    expect(schema).toMatchObject({
      type: 'object',
      properties: {
        a: {
          type: 'string',
        },
      },
      required: ['a'],
    })
  })

  test('should be able to create schema from object field with required fields', () => {
    const schema = createSchemaFromFields([
      {
        type: 'object',
        name: 'a',
        valueType: 'object',
        extraProps: {},
        fields: [
          {
            type: 'string',
            name: 'b',
            valueType: 'object',
            extraProps: {},
            validation: {
              mandatory: true,
            },
          },
          {
            type: 'string',
            name: 'c',
            valueType: 'object',
            extraProps: {},
            validation: {
              mandatory: true,
            },
          },
        ],
      },
    ])

    expect(schema).toMatchObject({
      type: 'object',
      properties: {
        a: {
          type: 'object',
          required: ['b', 'c'],
        },
      },
    })
  })

  test('should be able to create schema from nested object field with mixed validation rules', () => {
    const schema = createSchemaFromFields([
      {
        type: 'object',
        name: 'a',
        valueType: 'object',
        extraProps: {},
        fields: [
          {
            type: 'string',
            name: 'b',
            valueType: 'string',
            extraProps: {},
            validation: {
              format: 'email',
              maxLength: 30,
            },
          },
          {
            type: 'string',
            name: 'c',
            valueType: 'object',
            extraProps: {},
            fields: [
              {
                type: 'string',
                name: 'd',
                valueType: 'string',
                extraProps: {},
                validation: {
                  format: 'email',
                },
              },
              {
                type: 'string',
                name: 'e',
                valueType: 'string',
                extraProps: {},
                validation: {
                  mandatory: true,
                },
              },
              {
                type: 'string',
                name: 'f',
                valueType: 'object',
                extraProps: {},
                validation: {
                  mandatory: true,
                },
                fields: [
                  {
                    type: 'string',
                    name: 'g',
                    valueType: 'string',
                    extraProps: {},
                    validation: {
                      format: 'email',
                      mandatory: true,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ])

    expect(schema).toMatchObject({
      type: 'object',
      properties: {
        a: {
          type: 'object',
          properties: {
            b: {
              type: 'string',
              format: 'email',
              maxLength: 30,
            },
            c: {
              type: 'object',
              required: ['e', 'f'],
              properties: {
                d: {
                  type: 'string',
                  format: 'email',
                },
                e: {
                  type: 'string',
                },
                f: {
                  type: 'object',
                  required: ['g'],
                  properties: {
                    g: {
                      type: 'string',
                      format: 'email',
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
  })
})

describe('createMessagesFromFields: (fields: XFieldProps[] => IValidationMessageMap', () => {
  test('should be able to create minimal message map with mandatory field', () => {
    const messages = createMessagesFromFields([
      {
        ...baseField,
        validation: { mandatory: true },
        validationMessages: { mandatory: 'hit' },
      },
    ])
    expect(messages).toMatchObject({
      a: {
        mandatory: 'hit',
      },
    })
  })

  test('should be able to create message map with multiple fields', () => {
    const messages = createMessagesFromFields([
      {
        ...baseField,
        validation: { mandatory: true },
        validationMessages: { mandatory: 'hit' },
      },
      {
        ...baseField,
        name: 'b',
        $id: 'b',
        validation: { format: 'email' },
        validationMessages: { email: 'hit' },
      },
    ])

    expect(messages).toMatchObject({
      a: {
        mandatory: 'hit',
      },
      b: {
        email: 'hit',
      },
    })
  })

  test('should be able to create message map with multiple nested fields', () => {
    const messages = createMessagesFromFields([
      {
        ...baseField,
        validation: { mandatory: true },
        validationMessages: { mandatory: 'hit' },
      },
      {
        type: 'object',
        valueType: 'object',
        extraProps: {},
        name: 'b',
        $id: 'b',
        fields: [
          {
            type: 'string',
            valueType: 'string',
            extraProps: {},
            name: 'c',
            $id: 'b.c',
            validation: {
              mandatory: true,
              format: 'email',
            },
            validationMessages: { mandatory: 'hit', format: 'hit' },
          },
          {
            type: 'object',
            valueType: 'object',
            extraProps: {},
            name: 'd',
            $id: 'b.d',
            fields: [
              {
                type: 'string',
                valueType: 'string',
                extraProps: {},
                name: 'e',
                $id: 'b.d.e',
                validation: {
                  mandatory: true,
                  format: 'date',
                },
                validationMessages: { mandatory: 'hit', format: 'hit' },
              },
            ],
          },
        ],
      },
    ])

    expect(messages).toMatchObject({
      a: {
        mandatory: 'hit',
      },
      'b.c': {
        mandatory: 'hit',
        format: 'hit',
      },
      'b.d.e': {
        mandatory: 'hit',
        format: 'hit',
      },
    })
  })
})

describe('initXFieldValidation: (fields: XFieldProps[] => ValidateFn', () => {
  test('should be able to create a validator with no fields given', () => {
    const validation = initXFieldValidation()

    expect(validation).toBeDefined()
  })

  test('should be able to create a validator with fields given', () => {
    const fields: IXFieldProps[] = [
      {
        type: 'string',
        name: 'a',
        valueType: 'string',
        extraProps: {},
        validation: { mandatory: true },
        validationMessages: { mandatory: 'hit' },
      },
    ]

    const validation = initXFieldValidation(fields)

    expect(validation).toBeDefined()
  })
})

describe('validateFn: (value: IValue) => Promise<IValidationErrors>', () => {
  test('should be able to validate a field with no error', () => {
    const fields: IXFieldProps[] = [
      {
        type: 'string',
        name: 'a',
        valueType: 'string',
        extraProps: {},
        validation: { mandatory: true },
        validationMessages: { mandatory: 'hit' },
      },
    ]
    const validate = initXFieldValidation(fields)
    const valid = validate({ a: 'hello' })

    expect(valid).toMatchObject({})
  })

  test('should be able to validate a field with error and no custom message', async () => {
    const fields: IXFieldProps[] = [
      {
        type: 'string',
        name: 'a',
        $id: 'a',
        valueType: 'string',
        extraProps: {},
        validation: { mandatory: true },
      },
    ]
    const validate = initXFieldValidation(fields)
    const valid = await validate({})

    expect(valid).toMatchObject({ a: "should have required property 'a'" })
  })

  test('should be able to validate a field with error and custom message', async () => {
    const fields: IXFieldProps[] = [
      {
        type: 'string',
        name: 'a',
        $id: 'a',
        valueType: 'string',
        extraProps: {},
        validation: { mandatory: true },
        validationMessages: { mandatory: 'hit mandatory' },
      },
    ]
    const validate = initXFieldValidation(fields)
    const valid = await validate({})

    expect(valid).toMatchObject({ a: 'hit mandatory' })
  })
})
