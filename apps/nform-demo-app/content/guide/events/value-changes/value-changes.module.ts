import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';

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
})
@BindNgModule(ValueChangesExample)
export class ValueChangesExampleModule { }
