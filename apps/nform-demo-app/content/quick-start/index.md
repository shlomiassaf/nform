---
title: Quick Start
path: quick-start
tooltip: Quick Start
type: topMenuSection
ordinal: 0
searchGroup: quick-start
---
# QuickStart

## Install

First, install the packages.

```bash
yarn add @pebula/utils @pebula/metap @pebula/nform @pebula/nform-material
```

For this demo we use the `@pebula/nform-material` UI package which uses material component for form controls.

## NgModule setup

```typescript
import { NgModule } from '@angular/core';
import { PblNformMaterialModule } from '@pebula/nform-material';

@NgModule({
  /* ... */
  imports: [
    PblNformMaterialModule.forRoot()
  ],
  /* ... */
})
export class QuickStartAppModule { }
}
```

This will define the application module with **nForm** ready for use, in this case using form controls from the angular material library.

Now we can starting defining **models** and use them to render forms, for a basic example see [nForm Basics](../../guide/basics/nform-basics)
