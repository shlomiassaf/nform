import { NgModule } from '@angular/core';
import { FlexModule } from '@angular/flex-layout/flex';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { PblDemoAppSharedModule } from '@pebula/apps/shared';

import { DemoExamplesSharedModule } from './demo-examples-shared.module';

@NgModule({
  imports: [
    FlexModule, ExtendedModule,
    PblDemoAppSharedModule,
    DemoExamplesSharedModule,
  ],
  exports: [
    FlexModule, ExtendedModule,
    PblDemoAppSharedModule,
    DemoExamplesSharedModule,
  ]
})
export class ExampleCommonModule { }
