import { NgModule } from '@angular/core';
import { BrowserModule, makeStateKey } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FlexModule } from '@angular/flex-layout/flex';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { Angulartics2Module } from 'angulartics2';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PblNformMaterialModule } from '@pebula/nform-material';
import { PblNformDemoAppSharedModule } from '@pebula/apps/shared-nform';

import {
  PblDemoAppSharedModule,
  MarkdownPageContainerComponent,
  EXAMPLE_COMPONENTS,
  EXAMPLE_COMPONENTS_TOKEN,
  CONTENT_CHUNKS_COMPONENTS,
  LocationService,
  LazyModuleStoreService,
  LazyModulePreloader,
} from '@pebula/apps/shared';

import {
  AppContentChunksModule,
  APP_CONTENT_CHUNKS
} from '@pebula/apps/app-content-chunks';

import { environment } from '../environments/environment';
import { DemoHomePageComponent } from './demo-home-page/demo-home-page.component';
import { RouterLinkActiveNotify } from './demo-home-page/router-link-active-notify';

import { AppComponent } from './app.component';
import { LazyCodePartsModule } from './lazy-code-parts.module';

export function EXAMPLE_COMPONENTS_FACTORY() {
  return EXAMPLE_COMPONENTS;
}

export const REQ_KEY = makeStateKey<string>('req');

@NgModule({
  declarations: [
    AppComponent,
    DemoHomePageComponent,
    RouterLinkActiveNotify
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    TransferHttpCacheModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexModule,
    ExtendedModule,
    PblDemoAppSharedModule,
    AppContentChunksModule,
    MatListModule, MatButtonModule, MatTooltipModule, MatIconModule, MatMenuModule,
    LazyCodePartsModule.forRoot(),
    RouterModule.forRoot(
      [
        {
          path: '',
          children: [
            {
              path: '**',
              component: MarkdownPageContainerComponent
            }
          ]
        }
      ],
      {
        useHash: false,
        initialNavigation: 'enabledBlocking',
        preloadingStrategy: LazyModulePreloader,
        relativeLinkResolution: 'legacy',
      }
    ),
    Angulartics2Module.forRoot({
      developerMode: !environment.production,
      pageTracking: {
        autoTrackVirtualPages: true
      }
    }),
    PblNformDemoAppSharedModule.forRoot(),
    PblNformMaterialModule.forRoot(),
  ],
  providers: [
    { provide: CONTENT_CHUNKS_COMPONENTS, useValue: APP_CONTENT_CHUNKS },
    {
      provide: EXAMPLE_COMPONENTS_TOKEN,
      useFactory: EXAMPLE_COMPONENTS_FACTORY
    },
    LocationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(store: LazyModuleStoreService, lazyPreloader: LazyModulePreloader) {
    lazyPreloader.onCompile.subscribe(event => store.moduleRegistered(event));
  }
}
