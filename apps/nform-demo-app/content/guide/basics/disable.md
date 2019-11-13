---
title: Disable
path: guide/basics/disable
parent: guide/basics
ordinal: 1
---
# Disable

You can disable the entire form or a specific subset of controls in the form.

## Disable specific control

To mark controls as disabled, provide a list of form control identifiers to nForm:

```html
<pbl-nform [disabledState]="disabled"></pbl-nform>
```

where `disabled` is `string[]`.

I> nForm supports array diffing so you can mutate the existing array, or replace it on every change...

I> The disabled state is managed by `@angular/forms`, nForm will propagate the state to the form controls.

<div pbl-example-view="pbl-disable-example" rightDrawerOpened></div>

## Disable the Form

To disable the entire form you can use the **[disabled]** `@Input`.

```html
<pbl-nform [model]="model" disabled></pbl-nform>
```

<div pbl-example-view="pbl-disable-form-example"></div>
