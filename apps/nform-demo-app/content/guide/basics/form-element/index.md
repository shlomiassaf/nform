---
title: <form> Element
path: guide/basics/form-element
parent: guide/basics
ordinal: 1
---
# `<form>` Element

You can control how `<form>` is layout by using different component declarations.

```html
<pbl-nform [model]="model"></pbl-nform>
```

In the declaration above we let the component manage the internal layout and the final rendering will look something like this:

```html
<pbl-nform [model]="model">
  <form>
    <!-- FORM COMPONENTS... -->
  </form>
</pbl-nform>
```

<div pbl-example-view="pbl-form-element-example"></div>

While this is fine for most simple to moderate scenarios, in complex scenarios you will want to control the element warping the controls.  
Because `<form>` is rendered by the internal template of `pbl-nform` it is hard to control and style it.

Let's try a different layout:

```html
<form pbl-nform [model]="model"></form>
```

In the declaration above we we manage the form layout and the final rendering will look something like this:

```html
<form pbl-nform [model]="model">
  <!-- FORM COMPONENTS... -->
</form>
```

<div pbl-example-view="pbl-custom-form-element-example"></div>
