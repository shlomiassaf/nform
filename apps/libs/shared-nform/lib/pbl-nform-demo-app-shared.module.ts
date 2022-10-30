import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout/flex';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { PortalModule } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PblDemoAppSharedModule, MarkdownPageViewerRenderAdapter } from '@pebula/apps/shared';
import { PblNformMaterialModule } from '@pebula/nform-material';

import { MarkdownPageViewerFormRenderAdapter } from './example-form-view/markdown-page-viewer-form-render-adapter';
import { PblExampleFormViewComponent } from './example-form-view/example-form-view.component';
import { PblRowLayoutNformRenderer } from './row-layout-nform-renderer/row-layout-nform-renderer.component';
import { PblNformCreateNotify, PblNformCreateNotifier } from './pbl-nform-create-notify/pbl-nform-create-notify.directive';

@NgModule({
  imports: [
    CommonModule,
    FlexModule, ExtendedModule,
    PblDemoAppSharedModule,
    PortalModule, MatButtonModule, MatProgressBarModule, MatToolbarModule, MatTooltipModule,
    MatIconModule, MatMenuModule, MatSidenavModule, MatTabsModule, MatProgressSpinnerModule,
    PblNformMaterialModule,
  ],
  declarations: [
    PblExampleFormViewComponent,
    PblRowLayoutNformRenderer,
    PblNformCreateNotify,
  ],
  exports: [
    FlexModule, ExtendedModule,
    PblDemoAppSharedModule,
    PblExampleFormViewComponent,
    PblRowLayoutNformRenderer,
    PblNformCreateNotify,
  ],
  entryComponents: [ PblExampleFormViewComponent, PblRowLayoutNformRenderer ],
})
export class PblNformDemoAppSharedModule {
  static forRoot(): ModuleWithProviders<PblNformDemoAppSharedModule> {
    return {
      ngModule: PblNformDemoAppSharedModule,
      providers: [
        PblNformCreateNotifier,
        { provide: MarkdownPageViewerRenderAdapter, useClass: MarkdownPageViewerFormRenderAdapter },
      ]
    }
  }
}
