import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { ArraysExample } from './arrays.component';

@NgModule({
  declarations: [ ArraysExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
  ],
  exports: [ ArraysExample ],
  entryComponents: [ ArraysExample ],
})
@BindNgModule(ArraysExample)
export class ArraysExampleModule { }
