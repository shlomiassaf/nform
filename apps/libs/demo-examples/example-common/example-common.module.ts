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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { PblDemoAppSharedModule } from '@pebula/apps/shared';
import { PblNformMaterialModule } from '@pebula/nform-material';

import { PblNformDemoAppSharedModule } from '@pebula/apps/shared-nform';

@NgModule({
  imports: [
    CommonModule,
    FlexModule, ExtendedModule,
    PblDemoAppSharedModule,
    MatButtonModule, MatProgressBarModule, MatToolbarModule, MatTooltipModule,
    MatIconModule, MatMenuModule, MatSidenavModule, MatTabsModule,
    PblNformMaterialModule,
    PblNformDemoAppSharedModule,
  ],
  exports: [
    FlexModule, ExtendedModule,
    PblDemoAppSharedModule,
    PblNformDemoAppSharedModule,
  ],
})
export class ExampleCommonModule { }
