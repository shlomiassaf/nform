import { NgModule } from '@angular/core';
import { PblNFormModule, FORM_CONTROL_COMPONENT } from '@pebula/nform';
import { BindNgModule } from '@pebula/apps/shared';
import { PblRowLayoutNformRenderer } from '@pebula/apps/shared-nform';
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
  providers: [
    { provide: FORM_CONTROL_COMPONENT, useValue: PblRowLayoutNformRenderer },
  ],
})
@BindNgModule(BeforeRenderExample)
export class BeforeRenderExampleModule { }
