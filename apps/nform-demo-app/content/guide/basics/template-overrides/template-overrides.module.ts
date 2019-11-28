import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { TemplateOverridesExample } from './template-overrides.component';
import { ImperativeExample } from './imperative.component';

@NgModule({
  declarations: [ TemplateOverridesExample, ImperativeExample ],
  imports: [
    ExampleCommonModule,
    ReactiveFormsModule,
    PblNFormModule,
    MatButtonToggleModule, MatInputModule,
  ],
  exports: [ TemplateOverridesExample, ImperativeExample ],
  entryComponents: [ TemplateOverridesExample, ImperativeExample ],
})
@BindNgModule(TemplateOverridesExample, ImperativeExample)
export class TemplateOverridesExampleModule { }
