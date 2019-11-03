import { ANALYZE_FOR_ENTRY_COMPONENTS, NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Constructor } from '@pebula/utils';

import { TDMModelFormService, TDMModelFormDirective } from './tdm-model-form/index';
import {
  DynamicFormOverrideDirective,
  DynamicFormControlDirective,
  DynamicControlOutletDirective,
  DynamicFormArrayComponent,
  DynamicFormArrayDirective,
  ForFormArrayDirective,
  DynamicFormComponent,
  ExplodeChildFormPipe,
} from './dynamic-forms/index';

import { FORM_CONTROL_COMPONENT, DefaultRenderer } from './default-renderer';
@NgModule({
  declarations: [
    TDMModelFormDirective,
    DynamicFormOverrideDirective,
    DynamicFormControlDirective,
    DynamicControlOutletDirective,
    DynamicFormArrayComponent,
    DynamicFormArrayDirective,
    ForFormArrayDirective,
    DynamicFormComponent,
    ExplodeChildFormPipe
  ],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [
    TDMModelFormDirective,
    DynamicFormOverrideDirective,
    DynamicFormControlDirective,
    DynamicControlOutletDirective,
    DynamicFormArrayComponent,
    DynamicFormArrayDirective,
    ForFormArrayDirective,
    DynamicFormComponent,
    ExplodeChildFormPipe
  ]
})
export class PblNformModule {
  /**
   * Registers the module with and required services and with the default form control renderer.
   */
  static forRoot(formComponent: DefaultRenderer): ModuleWithProviders {
    return {
      ngModule: PblNformModule,
      providers: [
        TDMModelFormService,
        {
          provide: ANALYZE_FOR_ENTRY_COMPONENTS,
          multi: true,
          useValue: [{ component: formComponent }]
        },
        { provide: FORM_CONTROL_COMPONENT, useValue: formComponent }
      ]
    };
  }

  /**
   * Registers the module with the default form control renderer.
   * Use this when adding to child modules which requires a different renderer.
   */
  static forChild(formComponent: DefaultRenderer): ModuleWithProviders {
    return {
      ngModule: PblNformModule,
      providers: [
        {
          provide: ANALYZE_FOR_ENTRY_COMPONENTS,
          multi: true,
          useValue: [{ component: formComponent }]
        },
        { provide: FORM_CONTROL_COMPONENT, useValue: formComponent }
      ]
    };
  }
}
