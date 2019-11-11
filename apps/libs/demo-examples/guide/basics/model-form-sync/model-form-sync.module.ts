import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/demo-examples/example-common';
import { ModelFormSyncExample } from './model-form-sync.component';

@NgModule({
  declarations: [ ModelFormSyncExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
  ],
  exports: [ ModelFormSyncExample ],
  entryComponents: [ ModelFormSyncExample ],
})
@BindNgModule(ModelFormSyncExample)
export class ModelFormSyncExampleModule { }
