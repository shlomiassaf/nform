import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/demo-examples/example-common';
import { HideAndDisableExample } from './hide-and-disable.component';

@NgModule({
  declarations: [ HideAndDisableExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
  ],
  exports: [ HideAndDisableExample ],
  entryComponents: [ HideAndDisableExample ],
})
@BindNgModule(HideAndDisableExample)
export class HideAndDisableExampleModule { }
