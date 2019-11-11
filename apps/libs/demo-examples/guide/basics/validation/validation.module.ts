import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/demo-examples/example-common';
import { ValidationExample } from './validation.component';

@NgModule({
  declarations: [ ValidationExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
  ],
  exports: [ ValidationExample ],
  entryComponents: [ ValidationExample ],
})
@BindNgModule(ValidationExample)
export class ValidationExampleModule { }
