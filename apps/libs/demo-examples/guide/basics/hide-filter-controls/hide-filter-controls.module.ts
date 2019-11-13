import { NgModule } from '@angular/core';
import { PblNFormModule, FORM_CONTROL_COMPONENT } from '@pebula/nform';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { BindNgModule } from '@pebula/apps/shared';
import { PblRowLayoutNformRenderer } from '@pebula/apps/shared-nform';
import { ExampleCommonModule } from '@pebula/apps/demo-examples/example-common';
import { HideFilterControlsExample } from './hide-filter-controls.component';

@NgModule({
  declarations: [ HideFilterControlsExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNFormModule,
    MatSlideToggleModule, MatRadioModule, MatFormFieldModule, MatSelectModule,
  ],
  providers: [
    { provide: FORM_CONTROL_COMPONENT, useValue: PblRowLayoutNformRenderer },
  ],
  exports: [ HideFilterControlsExample ],
  entryComponents: [ HideFilterControlsExample ],
})
@BindNgModule(HideFilterControlsExample)
export class HideFilterControlsExampleModule { }
