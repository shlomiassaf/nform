---
title: Form Layout Pinning
path: guide/basics/form-layout-pinning
parent: guide/basics
tags: form,layout,pin
ordinal: 2
---
# Form Layout Pinning

In [Form Layout](../form-layout) we've learned that **nGrid** will layout the controls
one after the other, in the order they were defined.  
We can customize the layout by wrapping the controls with containers and styling them but
each of them will be rendered in sequence.

What if we would like to group some controls together? We can't do that without breaking the layout.

For example, we have a form with 5 controls:

- id
- name
- birth
- superPower
- bio

We want to display a single-column form, with one column holding 2 controls, like this:

- superPower
- id < - > name
- bio
- birth

<div pbl-example-view="pbl-form-layout-pinning-example"></div>

By using `<nform-pin controlName="id"></nform-pin>` create a pin for **nGrid** to render the control in, ignoring the layout.

## Location Only

Note that pinning has an effect only on the **location** the control will render in.  

With `<nform-pin>`, the control is rendered next to the `<nform-pin>` element it was referenced by (sibling).  
In fact, `<nform-pin>` has no visual effect and it is used as a marker only.

You can combine pinning with [template overrides](../template-overrides) to customize the layout entirely.

