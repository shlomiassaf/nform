---
title: Theming
path: concepts/theming/introduction
parent: concepts/theming
---
# Theming

In *nform* a theme is a set of pre-defined styles that together define the look and feel of the forms.

Usually, A theme is the set of colors that will be applied on the form but in n**Form** there are additional styles that
determine other aspects of the form controls such spacing definitions (height, margins, etc...).

Using a theme is mandatory as it contains the basic style instructions required to display the form.

There are 2 ways to use a theme:

1. Using a pre-built theme
2. Define a custom theme

## Using a pre-built theme

n**Form** comes prepackaged with several pre-built theme **css** files. All you have to do is to include a single css file for n**Form** in your app.

You can include a theme file directly into your application from `@pebula/nform/themes`.

Available pre-built themes:

- default-light.css
- default-dark.css

If you're using Angular CLI, this is as simple as including one line in your styles.css file:

```scss
@import '@pebula/nform/themes/default-light.css';
```

Alternatively, you can just reference the file directly. This would look something like:

```html
<link href="node_modules/@pebula/nform/themes/default-light.css" rel="stylesheet">
```

The actual path will depend on your server setup.

You can also concatenate the file with the rest of your application's css.

## Define a custom theme

When you want more customization than a pre-built theme offers, you can create your own theme file.

There are 2 configurable theme sections:

- Color & Spacing Palette
- Typography

n**Form** adopts the same system used by angular material to define and manage themes.

---

In Angular Material, a theme is created by composing multiple palettes. In particular, a theme consists of:

- A primary palette: colors most widely used across all screens and components.
- An accent palette: colors used for the floating action button and interactive elements.
- A warn palette: colors used to convey error state.
- A foreground palette: colors for text and icons.
- A background palette: colors used for element backgrounds.

W> n**Form** does not depend on angular material and does not implement the *Material Design* spec. The same theming system is used but not the same style!

---

n**Form** extends this data structure by:

- Extending the `foreground` and `background` palette's with additional, nform related, definitions.
- Adding a 6th palette called `spacing` that defines the spacing of the form (row height, cell margins, etc...)

I> In n**Form** the `accent` and `warn` palettes are not used, they exist only for compatibility.

To create a custom theme:

1. Create a palette from a color schema
2. Create a theme from your palette using `pbl-light-theme` or `pbl-dark-theme`
3. Render the theme by including the mixin `pbl-nform-theme`

A typical theme file will look something like this:

```scss
@import '~@pebula/nform/theming';

// 1. Create a palette from a color schema
$nform-palette: pbl-palette($pbl-blue);

// 2. Create a theme from your palette using `pbl-light-theme` or `pbl-dark-theme`
$pbl-nform-theme: pbl-dark-theme($nform-palette);

// Definitions for the form's typography, documented below...
@include pbl-nform-typography();

// 3. Render the theme by including the mixin `pbl-nform-theme`
@include pbl-nform-theme($pbl-nform-theme);
```

For more information visit the <a href="https://material.angular.io/guide/theming" target="_blank">Angular Material Themeing</a> guide.

### Color Schemas

In the example above we used the color schema `$pbl-blue` to create a palette, `$pbl-blue` is a built in color schema which explains how we use it.

I> A color schema is a set of color definitions, a main color and additional variants of the main color.

You can define your own color schemas, for inspiration take a look at the schemas defined in the <a href="https://github.com/angular/components/blob/8139358926b9d486b7f271778752fd73b50970af/src/material/core/theming/_palette.scss#L39" target="_blank">angular material project</a>.
To learn more about the color system visit the <a href="https://material.io/design/color" target="_blank">material design docs</a>

### Spacing

Spacing is visually similar to padding but it is defined differently.

This is the default spacing setup defined when you call `pbl-light-theme` or `pbl-dark-theme`:

```scss
$pbl-spacing-theme-default: (
  header-row-height: 56px,
  row-height: 48px,
  footer-row-height: 48px,
  row-spacing: 24px,
  cell-spacing: 12px,
);
```

- **header-row-height**: The minium height of header rows
- **row-height**: The minium height of form data rows
- **footer-row-height**: The minium height of footer rows
- **row-spacing**: The horizontal padding (left/right) of a row
- **cell-spacing**: The horizontal padding (left) of a cell

There is another default spacing theme called `$pbl-spacing-theme-narrow`:

```scss
$pbl-spacing-theme-default: (
  header-row-height: 32px,
  row-height: 26px,
  footer-row-height: 32px,
  row-spacing: 24px,
  cell-spacing: 12px,
);
```

#### Overriding the default spacing

```scss
@import '~@pebula/nform/theming';

$nform-palette: pbl-palette($pbl-blue);
$pbl-nform-theme: pbl-dark-theme($nform-palette);

// After the theme is defined but before it is included (rendered)
$narrow-spacing: ( spacing: $pbl-spacing-theme-narrow );
$pbl-nform-theme: map-merge($pbl-nform-theme, $narrow-spacing);

@include pbl-nform-typography();
@include pbl-nform-theme($pbl-nform-theme);
```

W> Make sure you update the theme variable before including `pbl-nform-theme`.

#### Multiple Spacings

For multiple spacing definitions we need custom classes with specific spacing values.

For this we use the mixin `pbl-nform-spacing` that only renders the CSS code related to spacing

```scss
@import '~@pebula/nform/theming';

$nform-palette: pbl-palette($pbl-blue);
$pbl-nform-theme: pbl-dark-theme($nform-palette);

@include pbl-nform-typography();
@include pbl-nform-theme($pbl-nform-theme);

// After the theme is included (rendered):
$narrow-spacing: ( spacing: $pbl-spacing-theme-narrow );
pbl-nform.slim {
  @include pbl-nform-spacing(map-merge($pbl-shell-theme, $narrow-spacing));
}
```

Now we can use `<pbl-nform class="slim"></pbl-nform>` for a slim form.

## Typography

In addition to the theme, you can also control the typography of the form.

nform adopts the same system used by angular material to define and manage a typography.

---

Angular Material defines typography as a way of arranging type to make text legible, readable, and appealing when displayed.

---

In simple words, with typography we define the font style for different element in the form.

For example, defining the font family, size and weight for header cells.

Similar to themes, the definitions are set in a data structure.

## Using with `@angular/material`

n**Form** theme system is almost identical to the theme system in `@angular/material` but does not depend on it.

However, if you're using `@angular/material` (and probably `@pebula/nform-material`), it is 100% compatible with a theme generated from `@angular/material`.

### Using with a prebuilt material theme

Angular material comes with 4 prebuilt themes:

- deeppurple-amber.css
- indigo-pink.css
- pink-bluegrey.css
- purple-green.css

For each theme there is a corresponding theme in `@pebula/nform-material`.

If you're using Angular CLI, this is as simple as including one line in your styles.css file:

```scss
@import '@angular/material/prebuilt-themes/deeppurple-amber.css';
@import '@pebula/nform-material/themes/deeppurple-amber.css';
```

Alternatively, you can just reference the file directly. This would look something like:

```html
<link href="node_modules/@angular/material/prebuilt-themes/indigo-pink.css" rel="stylesheet">
<link href="node_modules/@pebula/nform-material/themes/indigo-pink.css" rel="stylesheet">
```

## Using with a custom material theme

Let's recall the steps required for creating a theme without using angular material:

1. Create a palette from a color schema
2. Create a theme from your palette using `pbl-light-theme` or `pbl-dark-theme`
3. Render the theme by including the mixin `pbl-nform-theme`

When working with material we use the material tools to create a theme. n**Form** theme is compatible with a material theme so we can use the material theme with n**Form**.

The only thing required is to push missing definitions into the theme so it will work with n**Form**.

Luckily for us, `pbl-light-theme` and `pbl-dark-theme` which accept a palette and return a theme **can also** accept a theme and return a (new) theme, updated with all
the required definitions for n**Form**.

```scss
@import '~@angular/material/theming';
@import '~@pebula/nform/theming';

@include mat-core();

// Creating a material theme
$candy-app-primary: mat-palette($mat-indigo);
$candy-app-accent:  mat-palette($mat-pink, A200, A100, A400);
$candy-app-warn:    mat-palette($mat-red);
$candy-app-theme: mat-light-theme($candy-app-primary, $candy-app-accent, $candy-app-warn);

// Updating the theme to include nform definitions
$candy-app-theme: pbl-light-theme($candy-app-theme);

// rendering the material theme
@include angular-material-theme($candy-app-theme);
// rendering the nform theme
@include pbl-nform-theme($candy-app-theme);
```
