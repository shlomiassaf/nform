---
title: nForm Basics
path: guide/basics/nform-basics
parent: guide/basics
ordinal: 0
---
# nForm Basics

**nForm** is dynamic form library that creates forms based on pre-defined **models** (schemas).

A model is a **class** with additional **metadata**:

```typescript
import { Model, FormProp } from '@pebula/nform';

@Model({ form: true })
export class Hero {
  @FormProp({
    render: { vType: 'text', label: 'Hero Name' }
  })
  name: string;

  @FormProp({
    render: { vType: 'boolean', label: 'Super Hero' }
  })
  superHero: boolean;
}
```

The additional **metadata** is provided using the decorators and it contains information that **nform** use to render the form.

To render the form all we need to do is to provide an instance of the class to the form:

```typescript
@Component({
  template: '<pbl-nform [model]="model"></pbl-nform>',
})
export class MyComponent {
  model = new Hero();
}
```

At this point, the `Hero` instance is linked (bound) to `nform` but it's a **cold link**.

- Changing values on the UI form controls will not propagate to the `Hero` instance.
- Changing values on the `Hero` instance will not propagate to the form and UI controls

To update the `Hero` instance with the current form value we need to **commit**.  
To update the form with the current values from the `Hero` instance we need to **sync**.

I> It is also possible to **hot link** the instance so UI updates to the form controls will immediately **commit** to the `Hero` instance.

Here's an example with a **commit** and initial value set on the `Hero` instance **before** it is sent to `nform`

<div pbl-example-view="pbl-nform-basics-example"></div>

On the left (**A**) we can see the rendered form, containing 2 form controls and a **commit** button.  
On the right we can see the live values of the `Hero` class instance (**B**) and just below, the raw value of the underlying form used by **nForm**, `FormGroup` (**C**).

Try playing with the form on the left (**A**), every time you change a value it will immediately update the raw form value (**C**).  
To update the `Hero` class instance (**B**) you must first click the `COMMIT` button.

I> Notice how the `Hero Name` is pre-defined, this is because we provided a `Hero` instance with that value set.
