---
title: Complex Data Structures
path: guide/advanced-modeling/complex-data-structures
parent: guide/advanced-modeling
ordinal: 1
---
# Complex Data Structures

In this chapter we'll describe what is a complex data structure in **nForm** and review some
classic examples, this is more of a background and not **nForm** specific but it is required
to understand advanced modeling.

Let's start and examine the `Hero` model, there is something common to all properties, what is it:

```typescript
class Hero {
  id: number;
  name: string;
  hasTracking: boolean;
  doubleAgent: boolean;
  bmi: number;
  superPower: 'selfHealing' | 'flying' | 'cloaking' | 'cloning' | 'invisibility';
}
```

The type off all properties is either `boolean`, `number` or `string`. These are all **primitive** types.

W> The JavaScript standard defines 7 data types. 6 primitive types and the `Object` type.

The common to all properties is that they are all primitives, we call this model a flat model, it has a depth of 1.

Here is how an instance might look like:

```js
{
  id: "99",
  name: "Super Man",
  hasTracking: false,
  doubleAgent: true,
  bmi: 18,
  superPower: "flying"
}
```

We can imagine how a form will display, labels next to values, flat models are easy to display.

## Adding depth

A **non-primitive** type is any type that extends `Object`, these are all types except the 6 primitive
types defined by the standard.

Within all **non-primitive** types we differentiate 2 sub-groups: `Array` and `Object`.

Let's see some examples for depth:

```typescript
@FormModel()
export class Hero {  
  Prop2: Hero;
  Prop3: { value: string; id: number };
  Prop4_1: number[];
  Prop4_2: Hero[];
  Prop4_3: Array<{
    value: string;
    id: number,
    more: {
      deep: {
        sea: boolean;
      };
    };
  }>;
}
```

I> `Object` is the base type for all non primitive types, `Hero` is an object.

I> `Array` is therefor also an `Object` but it is a special case, handled differently.

Let's review how to work with both types, in the end we will inspect how to perform operations
required when working with complex data structures.

## Object

Our `Hero` model is an object with all properties being primitives.

```js
{
  id: "99",
  name: "Super Man",
  hasTracking: false,
  doubleAgent: true,
  bmi: 18,
  superPower: "flying"
}
```

It is also known as a *document*.

Once we add properties that are objects we create *embedded documents*

```typescript
interface Nemesis {
  id: number;
  name: string;
}

class Hero {
  ...

  nemesis: Nemesis;
}
```

```js
{
  id: 99,
  name: "Super Man",
  hasTracking: false,
  doubleAgent: true,
  bmi: 18,
  superPower: "flying",
  nemesis: {
    id: 100,
    name: "Bat Man"
  }
}
```

How do we display `nemesis`?

We have 2 options:

  1. Using a **child form**
  2. **Flattening** `nemesis`

### Child Forms

A child form is how we tell **nForm** that the type of a property is a **known model**.

The library will treat this property as a form and the renderer should display it.

There are a lot of ways for a renderer to implement child forms.  
Dialogs, inline, tabs, projection, etc... Each renderer and it's own implementation.

I> A **known model** is a class decorated with `@FormModel()`. The class is "known" to the library.

```typescript
@FormModel()
class Hero {
  @FormProp({
    childForm: true
  })
  nemesis: Nemesis;
}
```

W> Setting `childForm: true` is valid only when the type of the property is a **known model**.

[Read more...](../child-forms);

### Flattening

We've opened this chapter by saying the `Hero` is a flat model, what if we can define how to flatten
the `nemesis` property so all of it's properties will be on the `Hero` class?

```typescript
class Hero {
  /* Hero properties + ... */
  id: number;
  name: string;
}
```

We can, it is called flattening and we do it by providing a flattening definition:

```typescript
@FormModel()
class Hero {
  @FormProp({
    flatten: {
      id: {
        required: true,
        render: {
          vType: 'number',
          label: 'Nemesis ID',
        }
      },
      name: {
        required: true,
        render: {
          vType: 'text',
          label: 'Nemesis Name',
        }
      }
    }
  })
  nemesis: Nemesis;
}
```

It might look odd, we are flattening out the `id` and `name` properties from `Nemesis` which already exist in `Hero`.
There is no issue because this is not a **structural** change in the model but only in the display.

The form remains an identical representation of the model the only thing that change is the order and structure of the control we render.

Flattening definitions work on both known and unknown models. They are not limited in depth (i.e. you can define nested flattening definitions)

The actual structure of the model we work with and the structure of the form:

```js
{
  id: 99,
  name: "Super Man",
  hasTracking: false,
  doubleAgent: true,
  bmi: 18,
  superPower: "flying",
  nemesis: {
    id: 100,
    name: "Bat Man"
  }
}
```

However, the way they are presented:

```js
{
  id: 99,
  name: "Super Man",
  hasTracking: false,
  doubleAgent: true,
  bmi: 18,
  superPower: "flying",

  id: 100,
  name: "Bat Man"
}
```

The user will see the labels, not the property names.

[Read more...](../flattening);

## Arrays

Array's are unique, they create a structure that an `Object` can not represent directly. An indexed list.

Let change the `nemesis` for the `Hero` so we can set multiple rivals, a list of `Nemesis`:

```typescript
class Hero {
  ...

  nemesis: Array<Nemesis>;
}
```

When we look at the type: `Array<Nemesis>`, Array of T. The type of an Array is bound to the type of
the children it contains.

Working with array's does not require special metadata definitions, the definitions set on `@FormProp` are those you would define on the
type the array is bound to. Almost like the array is not there.

### Array of primitive

When an array is bound to a primitive the metadata definitions are those of the primitive,
the array is only used in the type annotation.

### Array of `Object`

When the array is bound to a complex type the definitions are those of the complex type an so, all the options we covered above are valid.

Yes, you can define an flattening definition for the interface `Nemesis` applied for on a list.

### Working with arrays

Working with array's it is best to keep things simple. Simple means array of primitives.
When in need to show an array of complex types prefer `childForm` while showing a list of models and editing each externally.

W> Avoid flattening declaration over an array. Unless you are building your own custom renderer and you are prepared for surprises.

[Read more...](../arrays)

## Tools

Working with flat models does not frequently involve operations on the structure of the model.

Working with complex data types **does**. Adding and/or removing items from an array,
assigning a form control to a `childForm` property and more...

The library provide the tools to simplify the process, which we covered in the [Controlling NForm](../controlling-nform) chapter, using `NForm`.

<!-- <div pbl-example-view="pbl-complex-data-structures-example"></div> -->
