---
title: Validation
path: guide/basics/validation
parent: guide/basics
ordinal: 4
---
# Validation

Validation in **nForm** is identical to the validation provided by `@angular/forms`,
**nForm** is only used to pass-through validation configuration to the form instance.

I> Note that since **nForm** uses reactive-forms, validation implementation must be in that style.

Validation is applied on 2 levels:

- Model level - Provided in the metadata for `@FormModel`
- Property level - Provided in the metadata for `@FormProp`

```typescript
import { Validators } from '@angular/forms';
import { FormModel, FormProp } from '@pebula/nform';

@FormModel({
   validators: getValidatorOnTheEntireModel()
})
export class Hero {
  @FormProp({
    /* ... */
    validators: Validators.compose([ Validators.min(18), Validators.max(120) ])
  })
  age: number;

  @FormProp({
    /* ... */
    asyncValidators: aFuncReturningAsyncPromise()
  })
  superHero: boolean;
}
```

## Required

The `required` validation is unique because it also validates the structure of an object, additionally required is a common validator, widely used.

For these reasons it can be set using a specific property.

```typescript
  @FormProp({
    /* ... */
     required: true,
  })
  age: number;
```

I> Setting the property `required` to true/false will add/remove the required validation so you do not need to handle that in the `validation` / `asyncValidation` properties.

## Dynamic Validation

The metadata defined in the decorators is static so the validators we define there are static in nature.

For example, if we want to validate a form control input against a server API request, we will need access to services (i.e: `HttpClient`) and other
things not available when creating the metadata.

W> The `validation` / `asyncValidation` properties are not tracked by the change detection, you must update the whole array, mutating the array will not trigger a rebuild of the validation function for the control.

In the following example we define a static numeric validator for the `Hero Id` property allowing values from 1000 to 999999.

In addition, we dynamically add `asyncValidator` when the form renders.

<div pbl-example-view="pbl-validation-example"></div>

I> When setting the name, watch how the status LED turns to blinking blue, this means PENDING state.

I> In this example we use the (beforeRender) event which is still not covered.
