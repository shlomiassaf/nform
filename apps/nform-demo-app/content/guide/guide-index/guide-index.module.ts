import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { GuideIndexExample } from './guide-index.component';

@NgModule({
  declarations: [ GuideIndexExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
  ],
  exports: [ GuideIndexExample ],
  entryComponents: [ GuideIndexExample ],
})
@BindNgModule(GuideIndexExample)
export class GuideIndexExampleModule { }
