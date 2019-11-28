---
title: Template Overrides
path: guide/basics/template-overrides
parent: guide/basics
ordinal: 6
---
# Template Overrides

**nForm** will render a form control using the default renderer it has access to.  
There are scenarios where a custom implementation is required, locally for a specific **nForm** instance.
The library supports that using template overrides.

This is a template override:

```html
<div *nFormOverride="'name'; let ctx">
  <span>{{ ctx.item.label }}</span>
  <input [formControl]="ctx.fControl">
</div>
```

**It says**:  
Use this template to render the control under located in the **name** property.  
Inside, the context (**ctx**) attached to control templates is declared and used to display the label and attach the `FormControl`.

I> The context also include rich metadata and methods that help
rendering controls.

In `<div *nFormOverride="'name'; let ctx">`, `'name'` is part of the query to match the control/s to override.

## Control Query

To replace an existing control or group of controls we first need
to describe what controls we want to override, this is the control query.

The query contains 2 fields:

- **Control name/path**: `string | string[]` (mandatory)
- **Visual type**: `string | string[]`

**The control name/path** is the path that leads to the control you want to replace, i.e. the property names on the model (**name** in the example above)

I> You can use dot notation for nested forms.

**The visual type** is the group of all controls in the form
that match the visual type.

For example, in the following model definition:

```ts
@FormModel()
export class Hero {
  @FormProp({ vType: 'text' } ) name: string;
}
```

The visual type for the property `name` is **text**.

### Catch all / Fallback

You can define a catch all / fallback template by setting the control path to `*`. It will match only if template exists for a given control (either by name or by type).

You can combine `*` with a visual type to define a template override for an entire visual type/s by setting catch all and a visual type/s.

I> Note that each **nForm** component has a default renderer defined, setting global catch all template override (`*` without a visual type) will turn the default render obsolete.

## Declarative Overrides

We use the structural directive `*nFormOverride` to declare what and how to override.

```html
<div  *nFormOverride="'name'; let ctx">
    <!-- LOCAL IMPLEMENTATION -->
</div>
```

In the example above we assign the local custom template to the field `name`, the template's lifespan is the lifespan of the **nForm** that is the host of the template.

We can also override the **catch all** (fallback) template, using `*`:

```html
<div  *nFormOverride="'*'; let ctx">
    <!-- LOCAL IMPLEMENTATION -->
</div>
```

### Targeting overrides by type

You can also target overrides by the field's visual type:

```html
<div *nFormOverride="'*'; let ctx; vType: ['boolean']">
    <!-- LOCAL IMPLEMENTATION -->
</div>
```

I> We've used an array for **vType**, which also accept a string. Same with field targeting, accepts both string and string array.

<div pbl-example-view="pbl-template-overrides-example"></div>

## Imperative Overrides

Template overrides can also be set using the **nForm** component API.

Get a hold of the `PblNformComponent` instance and a `TemplateRef` instance and use the `PblNformComponent.addOverride()` method.

The following example is a nice demonstration of a "control-less" form that shows the form as readonly html elements.  
The template overrides in this case are the catch-all template (*) which apply on all fields.

<div pbl-example-view="pbl-imperative-example"></div>

I> `*nFormOverride` is just a syntactic sugar to create a declarative model, it uses the **nForm** component API to get the job done.

## Precedence

The following represents the precedence when choosing how to render:

1. Specific template override (when exists)
2. Catch all template override (when exists)
3. Default renderer
