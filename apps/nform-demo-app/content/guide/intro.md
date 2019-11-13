---
title: Guide Introduction
path: guide/introduction
parent: guide
tooltip: How-to use the guide
ordinal: 0
---
# Guide Introduction

This tutorial is made up of a series of chapters, seen on the left.

A Chapter in this tutorial usually cover a single feature. In most cases it is followed by a live example with source code.

The order of the chapters matter as it build up features and dependant features.

There are 2 constructs that follow the entire tutorial and used by all
of the examples, these are the **model** (`Hero` class) and the
**renderer**.

The `Hero` class start simple and evolve as the tutorial progress
Each chapter might extend the `Hero` class  based on the feature it demonstrate.

Chapters that modify the **model** will review the change, all of the
examples in the code come with the model's source code.

Following chapters will use the updated version.

The **renderer** used in the tutorial is a predefined renderer that
implement UI components from the `@angular/material` UI framework, this
renderer is used for all chapters that demonstrates feature.

The last section of this tutorial is about custom renderer
implementation, chapters in this sections use the custom renderer
built for that purpose with each chapter modifying the **renderer** to
demonstrate a topic.

Renderer chapters cover how to create a renderer and offer strategies
for different scenarios, even if you are using a pre-built renderer it
is important to review them as they provide valuable insight.

I> The **model** and **renderer** described above are terms not yet discussed, mentioned here for reference only.
They are reviewed in the `Creating a Model` and `Simple Renderer` chapters.

## The Dashboard

The tutorial contains a lot of examples, in most of them you'll find a
container called the dashboard, this is an important tool, let's review
it quickly:

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
