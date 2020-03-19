import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';
import { PblNformMaterialModule } from '@pebula/nform-material';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { FormLayoutPinningExample } from './form-layout-pinning.component';

@NgModule({
  declarations: [ FormLayoutPinningExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
    PblNformMaterialModule,
  ],
  exports: [ FormLayoutPinningExample ],
  entryComponents: [ FormLayoutPinningExample ],
})
@BindNgModule(FormLayoutPinningExample)
export class FormLayoutPinningExampleModule { }
