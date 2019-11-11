import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/demo-examples/example-common';
import { AdvancedControlsExample } from './advanced-controls.component';

@NgModule({
  declarations: [ AdvancedControlsExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
  ],
  exports: [ AdvancedControlsExample ],
  entryComponents: [ AdvancedControlsExample ],
})
@BindNgModule(AdvancedControlsExample)
export class AdvancedControlsExampleModule { }
