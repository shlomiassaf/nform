import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/demo-examples/example-common';
import { HideAndDisableExample } from './hide-and-disable.component';
import { DisableFormExample } from './disable-form.component';

@NgModule({
  declarations: [ HideAndDisableExample, DisableFormExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNFormModule,
    MatSlideToggleModule, MatRadioModule, MatListModule, MatCheckboxModule
  ],
  exports: [ HideAndDisableExample, DisableFormExample ],
  entryComponents: [ HideAndDisableExample, DisableFormExample ],
})
@BindNgModule(HideAndDisableExample, DisableFormExample)
export class HideAndDisableExampleModule { }
