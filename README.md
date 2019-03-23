# @formalizer/core

## Standalone form model defined with JSON.

### The main purpose of Formalizer is to seperate the concerns encountered when dealing with dynamic form creation.

The model is basically a self managing state machine of a form and its fields, built by matching a given set of fields against a set of field models.

Formalizer is meant to be consumed by other software, and to make interaction between consumer and provider as simple as possible.

To achieve a transparent interaction layer between consumer and provider Formalizer lets the consumer **change properties on fields directly**, and offers a listener to let the consumer be made aware of changes in fields or the form.

Formalizer has built in support for field types of the basic value types available: "string", "number", "boolean", "array" and "object", which is enough for any scenario not involving any type of field rendering manifestation - and the willingness to write a lot of definitions.

To provide extendability aimed at letting field models be versatile, and ultimately also suited for varying rendering technology, Formalizer provides field model extendability and lets you inject any number of other field models with custom field properties.
