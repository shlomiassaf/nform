import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PblNFormModule, FORM_CONTROL_COMPONENT } from '@pebula/nform';
import { PblRowLayoutNformRenderer } from '@pebula/apps/shared-nform';
import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { FieldSyncRedrawExample } from './field-sync-redraw.component';

@NgModule({
  declarations: [ FieldSyncRedrawExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNFormModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  exports: [ FieldSyncRedrawExample ],
  entryComponents: [ FieldSyncRedrawExample ],
  providers: [
    { provide: FORM_CONTROL_COMPONENT, useValue: PblRowLayoutNformRenderer },
  ],
})
@BindNgModule(FieldSyncRedrawExample)
export class FieldSyncRedrawExampleModule { }
