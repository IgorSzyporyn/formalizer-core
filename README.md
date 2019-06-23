# @formalizer/core

[![Build Status](https://travis-ci.com/IgorSzyporyn/formalizer-core.svg?branch=master)](https://travis-ci.com/IgorSzyporyn/formalizer-core)
[![Greenkeeper badge](https://badges.greenkeeper.io/IgorSzyporyn/formalizer-core.svg)](https://greenkeeper.io/)
[![dependencies](https://david-dm.org/IgorSzyporyn/formalizer-core.svg)](https://david-dm.org/IgorSzyporyn/formalizer-core)
[![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

## Standalone form model and state machine.

The main purpose of Formalizer is to alleviate the concerns encountered when dealing with dynamic form creation, to function as a standalone form model and state machine.

Formalizer is meant to be consumed by other software, and to make interaction between consumer and provider as simple as possible.

There is built in support for the most basic fields available "string", "number", "boolean", "array" and "object", but can easily be extended to build custom field types of any kind to provide a versatile model setup.

Formalizer also provides validation through JSON Schema and AJV, and a dependency feature which lets you listen in on changes of other fields - setup criteria for a match and update any own property value either by setting it directly or using properties from any field in the tree.

Ultimately aimed at varying rendering technology, Formalizers field model extendability lets you inject any number of other field models with custom field properties.

## Configuration

In its simplest form you can just instanciate with no configuration.

```typescript
const formalizer = new Formalizer()
```

But in order for anything to happen, you have to send in as a minimum an array of fields.

```typescript
import { IFieldProps } from '@formalizer/core'

const fields: IFieldProps[] = [{ type: 'string', name: 'myField' }]

const formalizer = new Formalizer({ fields })
```

### Configuration Options

| Option          | Description                                                                    |            Type |
| :-------------- | :----------------------------------------------------------------------------- | --------------: |
| fields          | A collection of field definitions                                              |           Array |
| model           | Single model or collection of models used to convert a definition into a field | Array or Object |
| value           | If provided will be used as the initial value of the form and its fields       |          Object |
| onDirtyChange   | Callback that will fire when the value changes dirty state                     |        Function |
| onTouchedChange | Callback that will fire once when a field has had a property change            |        Function |
| onValidChange   | Callback that will fire when the validity of value changes                     |        Function |

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

Formalizer also sponsors 2 other projects that lets you see how Formalizer can be implemented for React.

- [@formalizer/react-form](https://github.com/IgorSzyporyn/formalizer-react-form)
- [@formalizer/react-xfields](https://github.com/IgorSzyporyn/formalizer-react-xfields)
