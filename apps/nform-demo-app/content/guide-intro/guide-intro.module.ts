import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { GuideIntroExample } from './guide-intro.component';

@NgModule({
  declarations: [ GuideIntroExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
    MatButtonModule,
  ],
  exports: [ GuideIntroExample ],
  entryComponents: [ GuideIntroExample ],
})
@BindNgModule(GuideIntroExample)
export class GuideIntroExampleModule { }
