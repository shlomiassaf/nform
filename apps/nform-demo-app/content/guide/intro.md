---
title: Guide Introduction
path: guide/introduction
parent: guide
tooltip: How-to use the guide
ordinal: 0
---
# Guide: How to

## The Dashboard

This guide contains a lot of live form example, each example contains a
single `pbl-nform` component wrapped within a **dashboard**.

The **dashboard** provides tools to interact with the form, inspect state and access to the source code. 

<div pbl-example-view="pbl-guide-intro-example"></div>

Before we start rocking let's review the environment you're about to use.  
The examples in this tutorial are all real time angular code, running
in your browser.  
Each example comes with a dashboard that provides tools to inspect and
interact with the example, it's internal form/s and library instances.  

The dashboard is the top panel, above the form showcased in the example.

**You've already seen the dashboard, it right above...**

Let's review what we can do with the dashboard:

### Real time form status indicator LED

The LED is located at the top left.

<div pbl-app-content-chunk="pbl-led-legend-chunk"></div>

### Source code view

The source code view can be toggled by the **< >** button located in
the left section of the dashboard.  

The source code view replace the form view, toggle it to see the form again.  

An example comes with a complete source code for the component/s, template/s,
style/s, model/s and any other code used by it.

### Form / Model interaction menu

Next to the source code button you will find the interaction menu.  
In the menu you will find some tools to help you interact with the
example and inspect the current state:

- **JSON View**
  Toggle's (show/hide) real time JSON view of the model or the form.  
  Appears in the **right panel** (we will get to panels in a bit)
  > If you don't know the difference between JSON view of model and form

  lease read the **Know your framework** section at the bottom.

- **Sync Form**
  Sync the form, this operation will updates the form values and validity status.  
  It just calls `updateValueAndValidity()` on the form.

- **Commit**
  Takes the current form and commits it to the model.
  > If you don't understand why we need to commit a form please read
  the **Know your framework** section at the bottom.
