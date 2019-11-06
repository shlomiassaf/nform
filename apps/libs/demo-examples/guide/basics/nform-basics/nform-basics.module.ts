import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/demo-examples/example-common';
import { NformBasicsExample } from './nform-basics.component';

@NgModule({
  declarations: [ NformBasicsExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNFormModule,
  ],
  exports: [ NformBasicsExample ],
  entryComponents: [ NformBasicsExample ],
})
@BindNgModule(NformBasicsExample)
export class NformBasicsExampleModule { }
