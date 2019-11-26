import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { BeforeRenderExample } from './before-render.component';

@NgModule({
  declarations: [ BeforeRenderExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
  ],
  exports: [ BeforeRenderExample ],
  entryComponents: [ BeforeRenderExample ],
})
@BindNgModule(BeforeRenderExample)
export class BeforeRenderExampleModule { }
