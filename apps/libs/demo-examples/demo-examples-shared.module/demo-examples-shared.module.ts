import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout/flex';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { PblDemoAppSharedModule } from '@pebula/apps/shared';

import { PblExampleFormWrapperComponent } from './example-form-wrapper/form-wrapper.component';
import { PblLedComponent } from './led/led.component';

@NgModule({
  imports: [
    CommonModule,
    FlexModule, ExtendedModule,
    PblDemoAppSharedModule,
    MatButtonModule, MatProgressBarModule, MatToolbarModule, MatIconModule, MatMenuModule, MatSidenavModule, MatTabsModule
  ],
  declarations: [ PblExampleFormWrapperComponent, PblLedComponent ],
  exports: [
    FlexModule, ExtendedModule,
    PblDemoAppSharedModule,
    PblExampleFormWrapperComponent,
  ]
})
export class DemoExamplesSharedModule { }
