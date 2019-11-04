import { NgModule, ModuleWithProviders } from '@angular/core';
import { ROUTES } from '@angular/router';
import { LAZY_MODULE_PRELOADING_MAP, LazyModulePreloader } from '@pebula/apps/shared';

export const ELEMENT_MODULE_PATHS_AS_ROUTES = [

];

@NgModule({ })
export class LazyCodePartsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LazyCodePartsModule,
      providers: [
        { provide: LAZY_MODULE_PRELOADING_MAP, useValue: ELEMENT_MODULE_PATHS_AS_ROUTES },
        { provide: ROUTES, useValue: ELEMENT_MODULE_PATHS_AS_ROUTES, multi: true },
        LazyModulePreloader,
      ]
    }
  }
}

