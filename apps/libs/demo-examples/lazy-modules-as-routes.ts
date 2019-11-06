export const ELEMENT_MODULE_PATHS_AS_ROUTES = [
  {
    path: 'guide-intro.module',
    pathMatch: 'full',
    loadChildren: () => import('@pebula/apps/demo-examples/guide-intro/guide-intro.module').then( m => m.GuideIntroExampleModule ),
  },
  {
    path: 'guide-basics-nform-basics.module',
    pathMatch: 'full',
    loadChildren: () => import('@pebula/apps/demo-examples/guide/basics/nform-basics/nform-basics.module').then( m => m.NformBasicsExampleModule ),
  }
];
