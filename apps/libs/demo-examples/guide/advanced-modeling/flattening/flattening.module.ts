import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/demo-examples/example-common';
import { FlatteningExample } from './flattening.component';

@NgModule({
  declarations: [ FlatteningExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
  ],
  exports: [ FlatteningExample ],
  entryComponents: [ FlatteningExample ],
})
@BindNgModule(FlatteningExample)
export class FlatteningExampleModule { }
