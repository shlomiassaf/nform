import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/demo-examples/example-common';
import { RenderStateExample } from './render-state.component';

@NgModule({
  declarations: [ RenderStateExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
  ],
  exports: [ RenderStateExample ],
  entryComponents: [ RenderStateExample ],
})
@BindNgModule(RenderStateExample)
export class RenderStateExampleModule { }
