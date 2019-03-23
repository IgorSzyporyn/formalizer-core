# @formalizer/core

## Standalone form model and state machine.

### Purpose

> The main purpose of Formalizer is to seperate the concerns encountered when dealing with dynamic form creation.

The model is basically a self managing state machine of a form and its fields, built by matching a given set of fields against a set of field models.

Formalizer is meant to be consumed by other software, and to make interaction between consumer and provider as simple as possible.

To achieve a transparent interaction layer between consumer and provider Formalizer lets the consumer **change properties on fields directly**, and offers a listener to let the consumer be made aware of changes in fields or the form.

Formalizer has built in support for field types of the basic value types available: "string", "number", "boolean", "array" and "object", which is enough for any scenario not involving any type of field rendering manifestation - and the willingness to write a lot of definitions.

To provide extendability aimed at letting field models be versatile, and ultimately also suited for varying rendering technology, Formalizer provides field model extendability and lets you inject any number of other field models with custom field properties.

### How is it used?

#### Configuration

In its simplest form (pun intended) you can just instanciate with no configuration

```javascript
const formalizer = new Formalizer()
```

But in order for anything to happen, you have to send in as a minimum an array of fields.

```javascript
const myFields = [{ type: 'string', name: 'myField' }]

const formalizer = new Formalizer({ fields: myFields })
```

#### Configuration Options

| Option             | Description                                                                                                                           |     Type |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | -------: |
| fields             | A collection of field definitions, each definition is converted to a xField using field mapping based on the fields "type" property   |    array |
| xFieldMap          | A collection of mappings used to convert a field into a xField                                                                        |    array |
| value              | If provided will be used as the initial value of the form and its fields                                                              |   object |
| registerExtraProps | Will be run every time a field is converted into a xField and merge a returned object on to the converted xFields "extraProps" object | function |

#### Formalizer Instance

Formalizer will return an instance with the following properties

| Property      | Description                                                                                                 |    Type |
| ------------- | ----------------------------------------------------------------------------------------------------------- | ------: |
| configuration | The configuration options supplied when creating the instance                                               |  object |
| dirty         | The form dirty state - meaning if value is different than initialValue                                      | boolean |
| initialValue  | The form value when instance was created                                                                    |  object |
| touched       | Has any value changed at any point since creation                                                           | boolean |
| value         | The form value this moment                                                                                  |  object |
| xFields       | The form fields converted from the supplied fields through the field map models                             |   array |
| xFieldMap     | The map of field models, created by merging any given supplied field model maps on to the core field models |   array |
| xFieldRefMap  | A flat dot notation map of xFields for fast and easy access                                                 |  object |

Formalizer also sponsors 2 other projects that lets you see how Formalizer can be implemented for React

- [@formalizer/react-form](https://github.com/IgorSzyporyn/formalizer-react-form)
- [@formalizer/react-xfields](https://github.com/IgorSzyporyn/formalizer-react-xfields)
