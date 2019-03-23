# @formalizer/core

## A standalone model of a form and its fields defined through a JSON Schema.

The instanciated Formalizer object (the "form") keeps track the fields, their internal relationships and the respective properties and values changing on its own - without the use of any methods other than the "addListener" method which lets you in on the changes.

This means that there is no API to look through to find out how to change the value of a field through some method as to not break the whole "system" keeping track of dirty states for both form and field etc...

All you do is access the field object of the Formalizer instance and change a property value **directly**, Formalizer will keep track of everything from there - and as mentioned let you attach a listener to be made aware for rendering purposes or whatever.

The schema features rich possibilities for having inter field relationships.

You can use @formalizer/core to build your own form tool viewer with whatever framework you prefer, the idea was to detach the logic and
