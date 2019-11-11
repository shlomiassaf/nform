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
  },
  {
    path: 'guide-basics-hide-and-disable.module',
    pathMatch: 'full',
    loadChildren: () => import('@pebula/apps/demo-examples/guide/basics/hide-and-disable/hide-and-disable.module').then( m => m.HideAndDisableExampleModule ),
  },
  {
    path: 'guide-basics-hot-binding.module',
    pathMatch: 'full',
    loadChildren: () => import('@pebula/apps/demo-examples/guide/basics/hot-binding/hot-binding.module').then( m => m.HotBindingExampleModule ),
  },
  {
    path: 'guide-basics-form-splitting.module',
    pathMatch: 'full',
    loadChildren: () => import('@pebula/apps/demo-examples/guide/basics/form-splitting/form-splitting.module').then( m => m.FormSplittingExampleModule ),
  },
  {
    path: 'guide-basics-validation.module',
    pathMatch: 'full',
    loadChildren: () => import('@pebula/apps/demo-examples/guide/basics/validation/validation.module').then( m => m.ValidationExampleModule ),
  },
  {
    path: 'guide-basics-model-form-sync.module',
    pathMatch: 'full',
    loadChildren: () => import('@pebula/apps/demo-examples/guide/basics/model-form-sync/model-form-sync.module').then( m => m.ModelFormSyncExampleModule ),
  },
  {
    path: 'guide-basics-template-overrides.module',
    pathMatch: 'full',
    loadChildren: () => import('@pebula/apps/demo-examples/guide/basics/template-overrides/template-overrides.module').then( m => m.TemplateOverridesExampleModule ),
  },
  {
    path: 'guide-basics-advanced-controls.module',
    pathMatch: 'full',
    loadChildren: () => import('@pebula/apps/demo-examples/guide/basics/advanced-controls/advanced-controls.module').then( m => m.AdvancedControlsExampleModule ),
  },
  {
    path: 'guide-advanced-modeling-complex-data-structures.module',
    pathMatch: 'full',
    loadChildren: () => import('@pebula/apps/demo-examples/guide/advanced-modeling/complex-data-structures/complex-data-structures.module').then( m => m.ComplexDataStructuresExampleModule ),
  },
  {
    path: 'guide-advanced-modeling-child-forms.module',
    pathMatch: 'full',
    loadChildren: () => import('@pebula/apps/demo-examples/guide/advanced-modeling/child-forms/child-forms.module').then( m => m.ChildFormsExampleModule ),
  },
  {
    path: 'guide-advanced-modeling-flattening.module',
    pathMatch: 'full',
    loadChildren: () => import('@pebula/apps/demo-examples/guide/advanced-modeling/flattening/flattening.module').then( m => m.FlatteningExampleModule ),
  },
  {
    path: 'guide-advanced-modeling-arrays.module',
    pathMatch: 'full',
    loadChildren: () => import('@pebula/apps/demo-examples/guide/advanced-modeling/arrays/arrays.module').then( m => m.ArraysExampleModule ),
  },
  {
    path: 'guide-layout-the-renderer.module',
    pathMatch: 'full',
    loadChildren: () => import('@pebula/apps/demo-examples/guide/layout/the-renderer/the-renderer.module').then( m => m.TheRendererExampleModule ),
  },
  {
    path: 'guide-events-before-render.module',
    pathMatch: 'full',
    loadChildren: () => import('@pebula/apps/demo-examples/guide/events/before-render/before-render.module').then( m => m.BeforeRenderExampleModule ),
  },
  {
    path: 'guide-events-field-sync-redraw.module',
    pathMatch: 'full',
    loadChildren: () => import('@pebula/apps/demo-examples/guide/events/field-sync-redraw/field-sync-redraw.module').then( m => m.FieldSyncRedrawExampleModule ),
  },
  {
    path: 'guide-events-render-state.module',
    pathMatch: 'full',
    loadChildren: () => import('@pebula/apps/demo-examples/guide/events/render-state/render-state.module').then( m => m.RenderStateExampleModule ),
  },
  {
    path: 'guide-events-value-changes.module',
    pathMatch: 'full',
    loadChildren: () => import('@pebula/apps/demo-examples/guide/events/value-changes/value-changes.module').then( m => m.ValueChangesExampleModule ),
  },
];
