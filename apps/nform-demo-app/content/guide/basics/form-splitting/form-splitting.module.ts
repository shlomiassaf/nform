import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { FormSplittingExample } from './form-splitting.component';

@NgModule({
  declarations: [ FormSplittingExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
  ],
  exports: [ FormSplittingExample ],
  entryComponents: [ FormSplittingExample ],
})
@BindNgModule(FormSplittingExample)
export class FormSplittingExampleModule { }
