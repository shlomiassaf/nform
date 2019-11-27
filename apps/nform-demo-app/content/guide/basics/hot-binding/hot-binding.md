---
title: Hot Binding
path: guide/basics/hot-binding
parent: guide/basics
ordinal: 3
---
# Hot Binding

When you provide a model instance to `<pbl-nform>` a matching form instance (e.g. `FormGroup`) is created.

The model instance and it's matching form instance are **cold linked**.

- Changing values on the UI form controls will not propagate to the `Hero` instance.
- Changing values on the `Hero` instance will not propagate to the form and UI controls

This is usually the preferred setup, as users might revert or cancel the form.

You can change this behavior and allow automatic synchronization of **form changes** into the model instance.  
This is a **hot link**, or **hot bind**.

If you wish to bind the form and the model together you can do that using the `hotBind` attribute:

```html
<pbl-nform [model]="model" hotBind></pbl-nform>
```

Here are some key-points to consider when using `hotBind`:

- **Binding is not syncing**  
When hot bind is switched on it does not sync previous changes. If you switch it off, update the form, then switch it on the model will not reflect the changes.

- **Binding is one-way**  
`hotBind` is one-way, it will automatically propagate **form changes** into the model instance **but not the other way around**.

- **Binding does not care about validity**  
The binding does not check for validity of the control, when the form updates the model updates

Try editing the form below, as long as hot bind is enabled, the model instance will reflect form changes immediately.

<div pbl-example-view="pbl-hot-binding-example" jsonView></div>
