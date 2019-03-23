// tslint:disable no-object-literal-type-assertion
import { IXFieldProps } from '../../src/models'
import { sanitizeValue, stringToValue, valueToString } from '../../src/utils/value'

describe('valueToString = (ValueTypes) => string', () => {
  test.each([
    [undefined, undefined],
    [null, null],
    ["", ""], ["Hello World", "Hello World"],
    [-1, "-1"], [0, "0"], [1,"1"],
    [true, "true"], [false, "false"],
    [{foo:'bar'}, "{\"foo\":\"bar\"}"],
    [[1,'foo',false], "[1,\"foo\",false]"]
  ])(
    'should convert %p => %p',
    (a: any, expected) => {
      expect(valueToString(a)).toEqual(expected)
    },
  )
})

describe('stringToValue = (string) => ValueTypes', () => {
  test.each([
    [undefined, undefined],
    [null, null],
    ["", undefined], ["Hello World", "Hello World"],
    ["-1", -1], ["0", 0], ["1", 1],  
    ["true", true], ["false", false],
    ["{\"foo\":\"bar\"}", {foo:'bar'}],
    ["[1,\"foo\",false]", [1,'foo',false]]
  ])(
    'should convert %p => %p',
    (a: any, expected) => {
      expect(stringToValue(a)).toEqual(expected)
    },
  )
})

describe('sanitizeValue = (IXFieldProps, ValueTypes) => ValueTypes', () => {

  describe('valueType = "string"', () => {
    test.each([
      [undefined, undefined],
      [null, null],
      ["", undefined],
      ["Hello World", "Hello World"],
      [1, "1"],
      [true, "true"],
      [false, "false"],
      [{foo:'bar'}, "{\"foo\":\"bar\"}"],
      [[1,'foo',false], "[1,\"foo\",false]"]
    ])(
      'should sanitize %p => %p',
      (a: any, expected) => {
        expect(sanitizeValue(({ valueType: 'string'} as IXFieldProps), a))
          .toEqual(expected)
      },
    )
  })

  describe('valueType = "number"', () => {
    test.each([
      [undefined, undefined],
      [null, null],
      ["", undefined],
      [1, 1],
      ["1", 1],
    ])(
      'should sanitize %p => %p',
      (a, expected) => {
        expect(sanitizeValue(
          ({ valueType: 'number'} as IXFieldProps), a)
        )
          .toEqual(expected)
      },
    )
  })

  describe('valueType = "boolean"', () => {
    test.each([
      [undefined, undefined],
      [null, null],
      ["", undefined],
      ["true", true],
      ["false", false],
      [0, false],
      [1, true],
    ])(
      'should sanitize %p => %p',
      (a: any, expected) => {
        expect(sanitizeValue(
          ({ valueType: 'boolean'} as IXFieldProps), a)
        )
          .toEqual(expected)
      },
    )
  })
})
