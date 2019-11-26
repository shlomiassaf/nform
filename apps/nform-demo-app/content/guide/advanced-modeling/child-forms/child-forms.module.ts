import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { ChildFormsExample } from './child-forms.component';

@NgModule({
  declarations: [ ChildFormsExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
  ],
  exports: [ ChildFormsExample ],
  entryComponents: [ ChildFormsExample ],
})
@BindNgModule(ChildFormsExample)
export class ChildFormsExampleModule { }
