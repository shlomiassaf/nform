import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout/flex';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { LiveExample } from '@pebula/apps/shared';

import { ExampleMaterialModule } from './material-module';
import { PblNFormModule } from '@pebula/nform';
import { PblDemoAppSharedModule } from '@pebula/apps/shared';

import { HomePageAppContentChunk } from './home-page/home-page.component';
import { PblLedLegendChunkComponent } from './pbl-led-legend/pbl-led-legend.component';

export const APP_CONTENT_CHUNKS_LIST = [
  HomePageAppContentChunk,
  PblLedLegendChunkComponent
]

export const APP_CONTENT_CHUNKS: {[key: string]: LiveExample} = {
  'pbl-led-legend-chunk': {
    title: '',
    component: PblLedLegendChunkComponent,
    additionalFiles: [],
    selectorName: ''
  },
  'pbl-home-page-app-content-chunk': {
    title: '',
    component: HomePageAppContentChunk,
    additionalFiles: [],
    selectorName: ''
  },
};

@NgModule({
  declarations: APP_CONTENT_CHUNKS_LIST,
  entryComponents: APP_CONTENT_CHUNKS_LIST,
  imports: [
    CommonModule,
    FlexModule,
    ExtendedModule,
    PblNFormModule,
    PblDemoAppSharedModule,
    ExampleMaterialModule,
  ]
})
export class AppContentChunksModule { }
