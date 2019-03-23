# @formalizer/core

A standalone model of a form and its fields defined through a JSON Schema.

The model of the form and fields keeps track of their respective properties and values on their own and lets your in on the action through a simple ** addListener ** method attached to each field as well as the form.

This means that there is no API to look through to find out how to change the value of a field through some method as to not break the whole "system" keeping track of dirty states for both form and field etc...
All you do is access the field object of the Formalizer instance and change a property value directly, Formalizer will keep track of everything from there - and as mentioned let you attach a listener to be made aware for rendering purposes or whatever.

The schema features rich possibilities for having inter field relationships.

You can use @formalizer/core to build your own form tool viewer with whatever framework you prefer, the idea was to detach the logic and
