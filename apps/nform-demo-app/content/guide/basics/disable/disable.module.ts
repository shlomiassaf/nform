import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PblNFormModule, FORM_CONTROL_COMPONENT } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { PblRowLayoutNformRenderer } from '@pebula/apps/shared-nform';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { DisableExample } from './disable.component';
import { DisableFormExample } from './disable-form.component';

@NgModule({
  declarations: [ DisableExample, DisableFormExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNFormModule,
    MatFormFieldModule, MatSlideToggleModule, MatSelectModule,
  ],
  providers: [
    { provide: FORM_CONTROL_COMPONENT, useValue: PblRowLayoutNformRenderer },
  ],
  exports: [ DisableExample, DisableFormExample ],
  entryComponents: [ DisableExample, DisableFormExample ],
})
@BindNgModule(DisableExample, DisableFormExample)
export class DisableExampleModule { }
