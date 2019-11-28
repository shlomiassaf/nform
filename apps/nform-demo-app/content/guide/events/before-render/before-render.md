---
title: (beforeRender)
path: guide/events/before-render
parent: guide/events
tags: events, beforeRender
ordinal: 0
---
# beforeRender Event

Event fired on the first render and then whenever the `PblNformComponent.redraw()` method is invoked.

The **beforeRender** event is best for:

- Updating or modifying element metadata and/or visual types.
- Deferring rendering of the form until an async operation completes.

The event emits an event handler object of type `BeforeRenderEventHandler`.

`BeforeRenderEventHandler` contains the record instances (`NFormRecordRef`) used by **nForm** and it is where we can alter each instance to change the way it will render or what data it will render with.

I> The records (`NFormRecordRef`) represent the form controls, we cover it in depth [below](../before-render#nformrecordref)

## Notifying about async operations

`BeforeRenderEventHandler` is also an API to notify **nForm** that it should **pause all rendering** until an async operation
finish by providing a promise. The component will not render control until the promise resolves.

I> Async operations are great for fetching remote data from the server, e.g. populating a selection box, updating the record and
returning control to **nForm** which will now render it with new options added.

<div pbl-example-view="pbl-before-render-example"></div>

This example changes the bmi field rendering type from slider to `number.

We will also mock an async call to a server to fetch 5 more super powers in addition to the 5 that already exist. The mock creates 1000ms timeout which in that time the form will not render.

To reduce noise some form controls are excluded.

W> Working with async operations requires user feedback (e.g. spinner).
The (renderState) covered next is where we can subscribe to notification about the rendering state, paused or not.

## NFormRecordRef

It is important to understand the role of the `NFormRecordRef` class and the relationship between the 3 building blocks of `@angular/forms`: `FormGroup`, `FormArray` and `FormControl` to `NFormRecordRef`.

Each property decorated by `@FormProp` contains metadata defined by the user which the library use to create an instance of `NFormRecordRef`. An instruction represents a single property and contains metadata about it like the type, how it should look like in a form and more.

`NFormRecordRef` is used to describe all properties, those can be primitive but can also be arrays and objects. This means that `NFormRecordRef` can also contain children of `NFormRecordRef`

When we create a new **nForm** component the library will use all 3 building blocks of `@angular/forms` to create a `FormGroup` instance that match the structure of our model, as described by us using `@FormProp`.

In the new form, for each form control, `FormGroup`, `FormArray` or `FormControl` there is a corresponding `NFormRecordRef` instance. The instance is cloned so different forms of the same model will never get the same `NFormRecordRef` instance, this is important as it is based on static metadata which is shared thus can not change.

If we take a `<select>` control as an example, it has a list of options to choose from and it is quite common to update the list based on logic or some data source.

It is also common to change the visual type of an element based on some logic.

This is why we create a new set of `NFormRecordRef`s per form.
