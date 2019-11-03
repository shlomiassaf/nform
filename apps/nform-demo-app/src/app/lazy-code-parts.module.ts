import { NgModule, ModuleWithProviders } from '@angular/core';
import { ROUTES } from '@angular/router';
import { LAZY_MODULE_PRELOADING_MAP, LazyModulePreloader } from '@pebula/apps/shared';

export const ELEMENT_MODULE_PATHS_AS_ROUTES = [
  {
    path: 'c3c34r2wedcasfawef-seller-demo.module',
    pathMatch: 'full',
    loadChildren: () => import('@pebula/apps/demo-examples/demos/seller-demo/seller-demo.module').then( m => m.SellerDemoExampleModule ),
  }
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

