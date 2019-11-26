---
title: Guide
path: guide
tooltip: How-to Guide
type: topMenuSection
ordinal: 1
searchGroup: guide
---
# NForm Guide

This guide will take you through the wonders of dynamic forms using the `@pebula/nform` package.

We will start with the basics, working with the simplest of forms and climb up into the wild west world of complex forms.

By the end of the tutorial you will be able to do the following:

- Create a model and render a FORM from it.
- Split a single form into Virtual Groups, rendering in different places.
- Hide, Disable or Filter controls
- Create a hot binding between a form and a model instance (instant change)
- Override the template for a specific control in a specific form.
- Populate control metadata in real time (e.g. A select box of users fetched from a changing source) 
- Render a form asynchronously, while fetching data from a server (e.g. Fetching the user list from a remote source)
- Update the UI when a form is not ready (e.g. blocker, spinner)
- Changing the type of a control on the fly and on demand
- Work with arrays, get notified on add/remove/move requests and apply
- Flatten nested objects in a model into a single level form  
- Invoke and control child forms (model within a model)
- And more, with cool examples

<div fxLayout fxLayoutAlign="center center" fxLayoutWrap="wrap">

<div style="display: flex">
  <div style="flex: 1 1 auto">

```typescript
export class UIDeveloper {
  name: string;

  yearOfBirth: number;

  gender: 'male' | 'female' | 'other';

  framework: 'angular' | 'react' | 'vue' | 'ember' | 'knockout' | 'other';
}
```

  </div>

  <div style="flex: 1 1 auto">
    <div pbl-example-view="pbl-guide-index-example" noToolbar></div>
  </div>
</div>

<!-- <mat-icon style="font-size:` 48px">compare_arrows</mat-icon> -->

It is recommended to first read the section on [how to use this guide](./introduction) which describes
the tools used by the guide and the dashboard you can use to interact with the live examples.

If you already familiar with it, you can [jump straight into the basics](./basics/nform-basics)
