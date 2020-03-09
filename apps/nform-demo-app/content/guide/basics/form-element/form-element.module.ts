import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { FormElementExample } from './form-element.component';
import { CustomFormElementExample } from './custom-form-element.component';

@NgModule({
  declarations: [ FormElementExample, CustomFormElementExample ],
  imports: [
    ReactiveFormsModule,
    ExampleCommonModule,
    PblNFormModule,
  ],
  exports: [ FormElementExample, CustomFormElementExample ],
  entryComponents: [ FormElementExample, CustomFormElementExample ],
})
@BindNgModule(FormElementExample, CustomFormElementExample)
export class FormElementExampleModule { }
