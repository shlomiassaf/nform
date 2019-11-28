---
title: Controlling Nform
path: guide/advanced-modeling/controlling-nform
parent: guide/advanced-modeling
ordinal: 0
---
# Controlling Nform

To create a **nForm** component we need an instance of a model which we bind to the [model] attribute.

```html
<pbl-nform [model]="model"></pbl-nform >
```

The **nForm** component will use the model to create a `FormGroup` instance and render that instance.

The model and the form group represent the same entity, the user can edit the form and once done we commit the changes done in the form onto the model.
The model and the form group are linked, an operation on one requires the other and there are tasks that apply on both.

We need a container we can put them both in and let the container manage them internally and expose an interface for us, a controller.

This is what the `NForm` class does, it is created by the **nForm** component and exposed through the property `nForm`.

## NForm

We've [already covered](../../basics/model-form-sync) what `commitToModel()` and `sync()` do, let continue from there:

## Read/Write

Using `getValue` and `setValue` we can read/write values from/to the form.

Using `getValueModel` we can read values from the model.

I> All read/write methods support deep paths using dot notation strings or deep path arrays, similar to how it is supported by `@angular/forms`,
`getValue` and `setValue` are just proxies.

I> `getValueModel` is aligned with the API allowing easy access to values on the model based on path's from the form, i.e. using the same path
you can get the form value and the model value.

W> Read/Write operations are common when working with complex data structure such as Array's or nested objects. We will revisit them in the relevant chapters.

## Working with Arrays

Adding and removing controls are operations performed on forms with arrays, these are `FormArray` controls.

When we want to add an item to a `FormArray` we can not added a new instance of the item, we need to add the form control that represent that item.

For example, a model with the property names of type string[], if we want to push a new string to the names property we can not use the model (`model.push('new name')`) instead we need to push a new `FormControl` to the `FormArray` that represent names.

What if **names** is not `string[]` but an array of a complex type, a nested model. Now we can't push a `FormControl` we need a `FormGroup`.

To simplify the process the addControl will do all the work for us.

`appendControl(path: Array<string | number> | string, value?: any): FormGroup | FormControl`  
We just need to provide the full path and a new form control is added. If we provide a **value** it will be used to populate the new control.

`removeControl(path: Array<string | number> | string, query: number | AbstractControl): AbstractControl | undefined`  
Here we also need a **query** which is the index we want to remove at or a control which the method will use to resolve the index to remove.

W> The **path** in the add/remove methods must point to an instance of FormArray

## Working with child forms

`createChildForm<Z = any>(path: Array<string | number> | string, model?: Z): TDMModelForm<Z>`  
A method that returns a new instance of the `NForm` class based on the type the **path** points at.

The type must be a known model and explicitly declared as a `childForm` in it's `FormPropMetadataArgs`.
The optional model parameter is used to populate the form (hint: use `getValueModel()` to get it)

I> `createChildForm` is used when working with complex data structures, child forms in particular.

<!-- <div pbl-example-view="pbl-controlling-nform-example"></div> -->
