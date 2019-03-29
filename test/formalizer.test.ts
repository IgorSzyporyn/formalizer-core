import { Formalizer } from '../src/formalizer'
import { xFieldMap as xFieldCoreMap } from '../src/xFieldMap'

const fields = [
  {
    type: "string",
    name: "string"
  },
  {
    type: "number",
    name: "number"
  },
  {
    type: "boolean",
    name: "boolean"
  },
  {
    type: "object",
    name: "object"
  },
  {
    type: "array",
    name: "array"
  },
]

test(
  'should be able to instanciate a instance with no options',
  () => {
    expect(new Formalizer()).toHaveProperty('formalizer')
  }
)

test(
  'should have empty xFields array if instanciated with no fields in options',
  () => {
    expect(new Formalizer().xFields).toEqual([])
  }
)

test(
  'should have core xFieldMap if instanciated with no xFieldMap in options',
  () => {
    expect(new Formalizer().xFieldMap).toEqual(xFieldCoreMap)
  }
)

test(
  'should be able to instanciate with one field of each core type',
  () => {
    expect(new Formalizer({ fields }).xFields.length).toEqual(5)
  }
)

test(
  'should be able to instanciate with one field of each core type',
  () => {
    expect(new Formalizer({ fields }).xFields.length).toEqual(5)
  }
)
