import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { FieldSyncRedrawExample } from './field-sync-redraw.component';

@NgModule({
  declarations: [ FieldSyncRedrawExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
  ],
  exports: [ FieldSyncRedrawExample ],
  entryComponents: [ FieldSyncRedrawExample ],
})
@BindNgModule(FieldSyncRedrawExample)
export class FieldSyncRedrawExampleModule { }
