import { NgModule } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { PblNFormModule, FORM_CONTROL_COMPONENT } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { PblRowLayoutNformRenderer } from '@pebula/apps/shared-nform';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { HotBindingExample } from './hot-binding.component';

@NgModule({
  declarations: [ HotBindingExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
    MatSlideToggleModule,
  ],
  providers: [
    { provide: FORM_CONTROL_COMPONENT, useValue: PblRowLayoutNformRenderer },
  ],
  exports: [ HotBindingExample ],
  entryComponents: [ HotBindingExample ],
})
@BindNgModule(HotBindingExample)
export class HotBindingExampleModule { }
