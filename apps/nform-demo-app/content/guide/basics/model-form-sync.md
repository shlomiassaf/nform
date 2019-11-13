---
title: "Sync: Model <-> Form"
path: guide/basics/model-form-sync
parent: guide/basics
ordinal: 5
---
# Model <-> Form Sync

When you provide a model instance to `<pbl-nform>` a matching form instance (e.g. `FormGroup`) is created.

The model instance and it's matching form instance are **cold linked**.

1. Changing values on the UI form controls will not propagate to the `Hero` instance. (commit)
2. Changing values on the `Hero` instance will not propagate to the form and UI controls. (sync)

I> We're temporarily ignoring [Hot Binding](../hot-binding) for the purpose of this section.

If we want to synchronize the model instance and the form instance there are 2 directions:

1. **Commit**  
Synchronize the current state of the form instance into the model instance ( Form -> Model )

2. **Sync**  
Synchronize the current state of the model instance into the form instance ( Model -> Form )

## The `NForm` class

When we create a model <-> form link, a controller is created that represents the link between the two.

This controller is the `NForm` class (it is not the component, `NFormComponent`), and it provides a lot of
functionality, among it the ability to **commit** and **sync**.

I> `NForm` provides a lot of tools, like easy read/write to the form, creating new controls, appending new items into form arrays and more.  

The `NForm` instance is located in the `nForm` property of the `NFormComponent` instance.

```html
<pbl-nform #nFormCmp [model]="model"></pbl-nform>
<!-- To access NForm, {{ nFormCmp.nForm }} -->
```

## Commit (Form -> Model)

```html
<pbl-nform #nFormCmp [model]="model"></pbl-nform>
<button [disabled]="nFormCmp.form.status !== 'VALID' || !nFormCmp.form.dirty" (click)="nFormCmp.nForm.commitToModel(true)">SAVE</button>
```

## Sync (Model -> Form)

<div pbl-example-view="pbl-model-form-sync-example"></div>
