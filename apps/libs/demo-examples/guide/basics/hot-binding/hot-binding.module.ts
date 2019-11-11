import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/demo-examples/example-common';
import { HotBindingExample } from './hot-binding.component';

@NgModule({
  declarations: [ HotBindingExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
  ],
  exports: [ HotBindingExample ],
  entryComponents: [ HotBindingExample ],
})
@BindNgModule(HotBindingExample)
export class HotBindingExampleModule { }
