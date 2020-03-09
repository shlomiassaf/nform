---
title: Form Layout
path: guide/basics/form-layout
parent: guide/basics
tags: form,layout
ordinal: 1
---
# Form Layout

The form layout describes how the form controls within the forms flow.  

For example, we can create a form with all controls rendering one after the other, **Horizontally**:

<div pbl-example-view="pbl-horizontal-form-layout-example"></div>

**Vertically**:

<div pbl-example-view="pbl-vertical-form-layout-example"></div>

Or, using **flex box**, allowing complex grid like capabilities.  
In the following example, a responsive 3-column layout design, using flex box via angular [flex-layout library](https://github.com/angular/flex-layout)

<div pbl-example-view="pbl-flex-form-layout-example"></div>

There are a lot of ways to control the layout:

- Using CSS Classes
- Using Template Overrides
- Using Renderers

In this chapter we will focus on layout using **Template Override** and how we declare `pbl-nform` can help us control the layout.

I> **Using CSS Classes** will work but it is more complex to reason about, especially with angular's view encapsulation. We will not discuss it in the tutorial.

I> **Using Renderers** is an advanced scenario, discussed later in the guide.  
In the examples above you might have noticed repetitive code use when creating template overrides, this is where **renderers** come into play.

## Declaring `pbl-nform`

There are 2 style we can declare the `NFormComponent` component:

1. `<pbl-nform></pbl-nform>`
2. `<form pbl-nform></form>`

In the **1st** declaration style we let the component control and manage the `form` element, resulting in the following rendered structure:

```html
<pbl-nform [model]="model">
  <form>
    <!-- FORM COMPONENTS... -->
  </form>
</pbl-nform
```

We used this in the first example (horizontal).

While this declaration style is fine for most simple to moderate scenarios, in complex scenarios you will want to control the element warping the controls.  
Because `<form>` is rendered by the internal template of `pbl-nform` it is hard to control and style it directly, to do so we will need to use CSS classes and / or renderers.

In the **2st** declaration style we control and manage the `form` element, resulting in the following rendered structure:

```html
<form pbl-nform [model]="model">
  <!-- FORM COMPONENTS... -->
</form>
```

With this declaration style we have full control over the form controls and over their direct parent, this is what allowed us to use flex-box directives
directly on the flex container and on the flex items directly (via template overrides).

I> Because we are declaring the `form` directly in our component, angular's view encapsulation is not an issue. This is also true for form-control's if we use template overrides.

## Creating meta driven layout

We've covered the basic approach of how to layout your form, this is the core technique used to create complex layout.  
Using other tools offered by the library you can design a powerful meta-driven layout system.

For example, by adding a `flex` property to the `data` object of each form property we can allow static declaration of our layout without using code.

```typescript
@FormModel()
export class Hero {
  @FormProp({
    vType: 'text',
    data: {
      flex: '0 1 65%',
    },
  })
  name: string;

  @FormProp({
    vType: 'boolean',
    data: {
      flex: '0 1 35%',
    },
  })
  superHero: boolean;
}
```

And in a custom template override:

```html
  <div *nFormOverride="'*'; let ctx" style="flex: {{ ctx.item.data?.flex }}">
    <material-form-control-renderer [nFormCmp]="nForm"
                                    [nForm]="ctx.nForm"
                                    [fArray]="ctx.fArray"
                                    [fControl]="ctx.fControl"
                                    [fGroup]="ctx.fGroup"
                                    [item]="ctx.item"></material-form-control-renderer>
  </div>
```

As previously mentioned, with **renderers** this can be fully automated, scoped and encapsulated, without the need of custom template overrides. (think plugin, addon, mini library)
