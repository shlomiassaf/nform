---
title: (valueChanges)
path: guide/events/value-changes
parent: guide/events
tags: events, valueChanges
ordinal: 2
---
# valueChanges Event

Event fired when the value of a form control changed.

The **valueChanges** event is best for:

- Getting notification about value change
- Update form state based on value-bound logic.
  For example:
  - disable control X when the value of control Y === Z
  - hide control Y when value of control X is not set
  - Fetch values from the server when the value of control Y === Z and use them to populate the select options for control X.

## Working with changes

The event emits a collection of changes based on the `KeyValueChangeRecord` from `@angular/core`.

The type of the collection is `NFormValueChanges` which is an array of `NFormValueChange` values.

`NFormValueChange` extends `KeyValueChangeRecord<string, any>` and adds the optional property **deep** which indicates if the key points to a deep path (dot notation) or a single property.

```typescript
export interface NFormValueChange extends KeyValueChangeRecord<string, any> {
  /* Part of KeyValueChangeRecord - Duplicated for documentation only */

  /** Current key in the Map. */
  readonly key: string;
  /** Current value for the key or `null` if removed. */
  readonly currentValue: any | null;
  /** Previous value for the key or `null` if added. */
  readonly previousValue: any | null;

  /* Part of KeyValueChangeRecord - Duplicated for documentation only */

  /**
   * When true indicates that the `key` property contains a path and not a name, i.e it's a dot delimited path to a
   * property through nested object (or objects)
   */
  deep?: boolean;
}
```

## Updating values

Updating values in response to a value change event requires an update to the value of a form control.  
The easiest and safest way is to use the `setValue()` method on the [NForm controller](../../advanced-modeling/controlling-nform), which was not covered yet.

### Updating in (valueChanges) is safe

Updating values inside the (valueChanges) event is safe and will not create an infinite update loop.

This is possible because:

- **valueChanges** events are synchronous, emitting all listeners in sequence.
- **valueChanges** events are blocking. While a valueChanges event run incoming change events are ignored.

This enables safe updates to the form.

If you want to change the value and force firing the event apply the value change async (i.e. setTimeout).

## **valueChanges** and nested objects

When the change occurs in a child property of nested objects the key property in the change event handler
represents the path (not the name) to the value from the root object.

In the following example **valueChanges** events are used to update state and values based on custom logic.

- The **id** property is disabled
- When the **name** property change the **id** is set to the length of the name
- When **doubleAgent** is set to `true` the **hasTracking** control is disabled and the value for it is set to `false`.

<div pbl-example-view="pbl-value-changes-example"></div>
