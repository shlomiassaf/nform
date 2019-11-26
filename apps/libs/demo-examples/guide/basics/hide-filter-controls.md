---
title: Hide / Filter Controls
path: guide/basics/hide-or-filter-controls
parent: guide/basics
ordinal: 2
---
# Hide / Filter Controls

**nForm** allow hiding or filtering of specific controls.

## Hiding Controls

Hidden is a pure UI state, the control is rendered but not displayed (e.g.: css `display: none`)

To mark hidden controls, provide a list of form control identifiers to nForm:

```html
<pbl-nform [hiddenState]="hidden"></pbl-nform>
```

where `hidden` is `string[]`.

I> nForm supports array diffing so you can mutate the existing array, or replace it on every change...

W> Since `hidden` is a UI state, the implementation is determined by renderer used. For example, one renderer might
choose to use css `display: none` while another might use css `visibility: hidden`

## Filtering Controls

Filter is a logical state, the control is rendered if it's not filtered. (think `*ngIf`)

To filter controls, provide a list of form control identifiers you want to **filter out**:

```html
<pbl-nform [filter]="filtered"></pbl-nform>
```

where `filtered` is `string[]`.

I> nForm supports array diffing so you can mutate the existing array, or replace it on every change...

### Inverting the filter

By default, all controls in the `[filter]` are **filtered out**, but this behavior can be changed
so all controls in the `[filter]` **and only them** are rendered:

```html
<pbl-nform [filter]="filtered" filterMode="include"></pbl-nform>
```

where `filterMode` is `'include' | 'exclude'`.

I> By default, `[filterMode]` is set to `exclude`

<div pbl-example-view="pbl-hide-filter-controls-example"></div>

## Filtered fields and Validation

If a control is excluded (filtered out) but it also fails form validation there is a dead-lock, the user can not
edit the control so the form is always invalid.

For example, in the form below the **Hero Name** field has a required validation but it is also excluded, it can never get a value assigned by the form.

To workaround this issue, you can mark excluded fields as [disabled fields](../disable). Since the form ignore disabled fields when
doing validation it will have no effect.
