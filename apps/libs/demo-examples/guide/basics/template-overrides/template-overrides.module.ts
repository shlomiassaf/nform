import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/demo-examples/example-common';
import { TemplateOverridesExample } from './template-overrides.component';

@NgModule({
  declarations: [ TemplateOverridesExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
  ],
  exports: [ TemplateOverridesExample ],
  entryComponents: [ TemplateOverridesExample ],
})
@BindNgModule(TemplateOverridesExample)
export class TemplateOverridesExampleModule { }
