import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout/flex';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { LiveExample } from '@pebula/apps/shared';

import { ExampleMaterialModule } from './material-module';
import { PblNformModule } from '@pebula/nform';

export const APP_CONTENT_CHUNKS_LIST = [

]

export const APP_CONTENT_CHUNKS: {[key: string]: LiveExample} = {
};

@NgModule({
  declarations: APP_CONTENT_CHUNKS_LIST,
  entryComponents: APP_CONTENT_CHUNKS_LIST,
  imports: [
    CommonModule,
    FlexModule,
    ExtendedModule,
    PblNformModule,
    ExampleMaterialModule,
  ]
})
export class AppContentChunksModule { }
