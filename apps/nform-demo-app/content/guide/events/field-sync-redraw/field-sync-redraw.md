---
title: Field Sync / Field Redraw
path: guide/events/field-sync-redraw
parent: guide/events
tags: events, sync, redraw
ordinal: 3
---
# Field Sync / Form Redraw

As explained and demonstrated in the [beforeRender](../before-render) event chapter,
`NFormRecordRef` instances control the rendering output of a form field.

The event is emitted on first load but also when the `redraw()` method is invoked, so it means that the `redraw()` method is way to update data required for form control rendering or if an event changes the type of it which will result in a completely different component rendered for that form control.

In fact, there are 2 ways to update a `NFormRecordRef` instance, a redraw or a field sync.

## Redraw

Perform A complete redraw that will re-render all of the controls in the form and emit the **beforeRender** event. This approach is like a re-init to the rendered form.

## Field Sync

A field sync is more subtle and involves re-rendering of a single form control, it does not emit any events and does not apply any asynchronous logic.

## What should I use

A redraw emit events, so if you have a UI blocker component that shows when the form is rendering and you know that async operations will run then use it.

A field sync will not fire events so it might be handy when updating the type of a component or some metadata related to it.

It can also be used for async operations but you will need to block the UI manually or block that specific control manually.

Sometimes, especially when change detection is not strict, changing just data does not require a redraw or a field sync.

In the example below the **superPower** field is being rendered with the `select` visual type, you can toggle the rendered component between select and radio and click on the buttons to see how each approach effects the UI

<div pbl-example-view="pbl-field-sync-redraw-example"></div>
