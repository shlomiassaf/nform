import { NgModule } from '@angular/core';
import { PblNFormModule, FORM_CONTROL_COMPONENT } from '@pebula/nform';
import { PblRowLayoutNformRenderer } from '@pebula/apps/shared-nform';
import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { ValueChangesExample } from './value-changes.component';

@NgModule({
  declarations: [ ValueChangesExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
  ],
  exports: [ ValueChangesExample ],
  entryComponents: [ ValueChangesExample ],
  providers: [
    { provide: FORM_CONTROL_COMPONENT, useValue: PblRowLayoutNformRenderer },
  ],
})
@BindNgModule(ValueChangesExample)
export class ValueChangesExampleModule { }
