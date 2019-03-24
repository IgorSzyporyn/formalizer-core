![Formalizer Core](https://user-images.githubusercontent.com/6172338/54886646-9f811100-4e8a-11e9-94b1-4c1ee1182565.png)

[![Build Status](https://travis-ci.com/IgorSzyporyn/formalizer-core.svg?branch=master)](https://travis-ci.com/IgorSzyporyn/formalizer-core)
[![Greenkeeper badge](https://badges.greenkeeper.io/IgorSzyporyn/formalizer-core.svg)](https://greenkeeper.io/)
[![dependencies](https://david-dm.org/IgorSzyporyn/formalizer-core.svg)](https://david-dm.org/IgorSzyporyn/formalizer-core)
[![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

The main purpose of Formalizer is to seperate the concerns encountered when dealing with dynamic form creation, to function as a standalone form model and state machine.

The model is basically a self managing state machine of a form and its fields, built by matching a given set of fields against a set of field models.

Formalizer is meant to be consumed by other software, and to make interaction between consumer and provider as simple as possible.

To achieve a transparent interaction layer between consumer and provider Formalizer lets the consumer **change properties on fields directly**, and offers a listener to let the consumer be made aware of changes in fields or the form.

Formalizer has built in support for field types of the basic value types available: "string", "number", "boolean", "array" and "object", which is enough for any scenario not involving any type of field rendering manifestation - and the willingness to write a lot of definitions.

To provide extendability aimed at letting field models be versatile, and ultimately also suited for varying rendering technology, Formalizer provides field model extendability and lets you inject any number of other field models with custom field properties.

## Configuration

In its simplest form (pun intended) you can just instanciate with no configuration.

```typescript
const formalizer = new Formalizer()
```

But in order for anything to happen, you have to send in as a minimum an array of fields (and maybe a model as in example).

Note: The TypeScript generic (ExtraProps) here is optional, but will be made available by model provider if you are using any model(s).

```typescript
import { IFieldProps } from '@formalizer/core'
import { IExtraProps, formalizerFieldModel } from '@formalizer/field-model'

const myFields: IFieldProps<ExtraProps>[] = [
  { type: 'string', name: 'myField' },
]

const formalizer = new Formalizer<ExtraProps>({
  fields: myFields,
  model: formalizerFieldModel,
  value: { myField: 'Hello World' },
})
```

### Configuration Options

| Option | Description                                                                                                                         |            Type |
| :----- | :---------------------------------------------------------------------------------------------------------------------------------- | --------------: |
| fields | A collection of field definitions, each definition is converted to a xField using field mapping based on the fields "type" property |           Array |
| model  | Single model or collection of models used to convert a field into a xField                                                          | Array or Object |
| value  | If provided will be used as the initial value of the form and its xFields                                                           |          Object |

### Field Configuration Options (\* means required)

Please note that the values for **type** can vary depending on what model you supply, as does the properties available in **extraProps**

| Property     | Description                                                                                                      |       Type |
| :----------- | :--------------------------------------------------------------------------------------------------------------- | ---------: |
| type\*       | Core supports "string", "number", "boolean", "array" and "object" without any model supplied in config           |     String |
| name\*       | The name of the field                                                                                            |     String |
| dependencies | Collection of dependencies with match criteria to run agains another field upon changes in the fields properties |      Array |
| disabled     | If supplied the field will be disabled (value will no longer figure in form value etc...)                        |    Boolean |
| emptyValue   | If supplied will be as the value representation in form value when field value is undefined                      |  ValueType |
| extraProps   | An object of extra property definitions for this field                                                           | ExtraProps |
| nullable     | If true then the fields value will be null when undefined                                                        |    Boolean |
| value        | If supplied will work as the initial value of the field (will be overriden by initial value set on form if any)  |  ValueType |

## Formalizer Instance

Formalizer will return an instance with the following properties

| Property      | Description                                                                                                 |     Type |
| :------------ | :---------------------------------------------------------------------------------------------------------- | -------: |
| addListener   | Method that will execute a given function when a property changes on the form instance                      | Function |
| configuration | The configuration options supplied when creating the instance                                               |   Object |
| dirty         | The form dirty state - meaning if value is different than initialValue                                      |  Boolean |
| initialValue  | The form value when instance was created                                                                    |   Object |
| touched       | Has any value changed at any point since creation                                                           |  Boolean |
| value         | The form value this moment                                                                                  |   Object |
| xFields       | The form fields converted from the supplied fields through the field map models                             |    Array |
| xFieldMap     | The map of field models, created by merging any given supplied field model maps on to the core field models |   Object |
| xFieldRefMap  | A flat dot notation map of xFields for fast and easy access                                                 |   Object |

Formalizer also sponsors 2 other projects that lets you see how Formalizer can be implemented for React

- [@formalizer/react-form](https://github.com/IgorSzyporyn/formalizer-react-form)
- [@formalizer/react-xfields](https://github.com/IgorSzyporyn/formalizer-react-xfields)
