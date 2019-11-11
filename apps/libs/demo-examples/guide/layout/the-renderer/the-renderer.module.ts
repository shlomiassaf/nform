import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/demo-examples/example-common';
import { TheRendererExample } from './the-renderer.component';

@NgModule({
  declarations: [ TheRendererExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
  ],
  exports: [ TheRendererExample ],
  entryComponents: [ TheRendererExample ],
})
@BindNgModule(TheRendererExample)
export class TheRendererExampleModule { }
