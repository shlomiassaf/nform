import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PblNFormModule, FORM_CONTROL_COMPONENT } from '@pebula/nform';
import { PblRowLayoutNformRenderer } from '@pebula/apps/shared-nform';
import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { RenderStateExample } from './render-state.component';

@NgModule({
  declarations: [ RenderStateExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNFormModule,
    MatProgressSpinnerModule,
  ],
  exports: [ RenderStateExample ],
  entryComponents: [ RenderStateExample ],
  providers: [
    { provide: FORM_CONTROL_COMPONENT, useValue: PblRowLayoutNformRenderer },
  ],
})
@BindNgModule(RenderStateExample)
export class RenderStateExampleModule { }
