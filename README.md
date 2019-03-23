# @formalizer/core

## A standalone model of a form and its fields defined through a JSON Schema.

The instanciated Formalizer object (the "form") is fully self managing - meaning it keeps track of its fields, the fields internal relationships and the changes in properties and values, and what that may mean to the state across the "form" - and it does so without the use of methods.

This means that there is no API to look through to find out how to change the value of a field through some method as to not break the whole "system" keeping track of dirty states for both form and field etc...

All you do is access the field object of the Formalizer instance and change a property value **directly**, Formalizer will keep track of everything from there - and as mentioned let you attach a listener to be made aware for rendering purposes or whatever.

The schema has rich possibilities for having inter field relationships through a simple yet powerful dependencies feature which lets you describe any number of match criteria another field may encounter through changes in properties, and alter any property on the field with the dependency when the change occur.

You can use @formalizer/core to build your own form tool viewer with whatever framework you prefer, the idea was to detach the logic and state managment from the actual form renderers and just let them be very simple functional bits that can ask to listen in on changes through the **addListener** method and just simple set property values directly when interacting with the Formalizer instance and its fields.
