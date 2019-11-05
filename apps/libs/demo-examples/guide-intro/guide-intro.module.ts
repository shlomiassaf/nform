import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/demo-examples/example-common';
import { GuideIntroExample } from './guide-intro.component';

@NgModule({
  declarations: [ GuideIntroExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
  ],
  exports: [ GuideIntroExample ],
  entryComponents: [ GuideIntroExample ],
})
@BindNgModule(GuideIntroExample)
export class GuideIntroExampleModule { }
