---
title: Form Splitting
path: guide/basics/form-splitting
parent: guide/basics
ordinal: 7
tabs: multiple wizard steps
---
# Form Splitting

Form splitting provides the ability to extract specific form controls out of the form and render them in a different location, outside the `<form>`.
This is only a UI separation, the logical structure is still in place.

There are 2 ways to split:

1. Pick specific control/s and renderer them elsewhere ([Outlet Splitting](../form-splitting#outlet-splitting))
2. Pick specific control/s and render them as a part of a different **nForm** component ([Virtual Groups](../form-splitting#virtual-groups))

## Outlet Splitting

In the angular vocabulary, an **outlet** usually represent a location in the view that acts as a placeholder for dynamic content injection.  
Outlets provide a declarative and elegant solution when we want to show content in a specific place but renderer it in isolation.  
The `router-outlet` component is a good example, it is a location in the view that marks the place where the router will inject components based on the URL.  

I> Outlet's are powerful because they allow to define and render content with specific context and inject it elsewhere, outside of the block the context is bound to, while keeping access to that context.

<div pbl-example-view="pbl-form-splitting-example"></div>

**What did we do?**

We've **replaced** the `superPower` field showing an `<select>` element with an `<h3>` element and **projected** the original
component in the location marked by the outlet.

This was all done through the template, let's review the code:

```html
<pbl-nform #nForm [model]="model"></pbl-nform>

<div class="red-super-power-box">
  <h3 *nformControlOutlet="'superPower'; let ctx; nFormCmp: nForm">Super Power Was Here, Now It's In The Red Box</h3>
</div>
```

It requires the **nForm** component as an input, and much like [template override](../template-overrides#control-query) templates, `NFormControlOutletDirective` also requires a control query, to match the control to extract and render in the outlet and also exports `NFormOverrideContext` as context.

Because we've used a structural directive (`*nformControlOutlet`) result was **replace and project**

`nformControlOutlet` can work in a non-structural way as way which will **only project** the control and remove it from the original location.

```html
<div nformControlOutlet="superPower" [nformControlOutletNFormCmp]="nForm"></div>
```

W> Similar to `<router-outlet>` the content is injected to the view container for the outlet, this means next to it as a sibling and not inside.

## Virtual Groups

Virtual groups allow splitting the same form instance over multiple **nForm** components, i.e. over multiple `<form>` blocks.

A virtual group is a **nForm** component that is sharing it's model instance with another non-virtual **nForm** component.

I> We call the non-virtual nForm component **master** and all other virtual group components are **salve**.

To define the relationship we use the `[slaveOf]` input.

```html
<pbl-nform #nFrom [model]="model"></pbl-nform>
<pbl-nform [slaveOf]="nFrom"></pbl-nform>
```

### slaveOF

- Setting the `[model]` input is not allowed when a **nForm** component is defined as slave.
- Salve's are purely UI, all interaction should be done with the master.

Because slave's are purely UI all of the form related features are not allowed on slave components, instead
use the through the master instance.

Examples:

- All events originated from the form (value changes, state changes, etc...) will not work properly if registered on the slave form, instead register on the master.
- The disable state (`[disabledState]`) is based on form control state so it will not work properly if bound to a slave form, instead bind to the master. 
- `[hiddenState]` and `[filter]` are purely UI so they will work slaves, as well as template overrides and the `beforeRender` and `renderState` events.

W> When working with a master/slave setup make sure not to display the same form control in more then one dynamic form. Sync is not guaranteed and you might experience unexpected results. Use `[filter]` to control rendered control between the groups.

In the following example the form is split to 2 groups:

<div pbl-example-view="pbl-virtual-groups-example"></div>

### Wizards

Now, 3 groups, tabbed:

<div pbl-example-view="pbl-virtual-groups-wizard-example"></div>

Can you see how this easily qualify as a multi-step wizard?

Virtual groups allows working with multiple forms while automatically synchronizing them, hiding the complexity.
After committing the master, the model instance will reflect the state of the master form and all of the slaves as if they we're one.
