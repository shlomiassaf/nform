import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PblNFormModule } from '@pebula/nform';
import { PblNformMaterialModule } from '@pebula/nform-material';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { VerticalFormLayoutExample } from './vertical-form-layout.component';
import { HorizontalFormLayoutExample } from './horizontal-form-layout.component';
import { FlexFormLayoutExample } from './flex-form-layout.component';

@NgModule({
  declarations: [ VerticalFormLayoutExample, HorizontalFormLayoutExample, FlexFormLayoutExample ],
  imports: [
    ReactiveFormsModule,
    ExampleCommonModule,
    PblNFormModule,
    PblNformMaterialModule,
  ],
  exports: [ VerticalFormLayoutExample, HorizontalFormLayoutExample, FlexFormLayoutExample ],
  entryComponents: [ VerticalFormLayoutExample, HorizontalFormLayoutExample, FlexFormLayoutExample ],
})
@BindNgModule(VerticalFormLayoutExample, HorizontalFormLayoutExample, FlexFormLayoutExample)
export class FormElementExampleModule { }
