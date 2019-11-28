import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { ControllingNFormExample } from './controlling-nform.component';

@NgModule({
  declarations: [ ControllingNFormExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
  ],
  exports: [ ControllingNFormExample ],
  entryComponents: [ ControllingNFormExample ],
})
@BindNgModule(ControllingNFormExample)
export class ControllingNFormExampleModule { }
