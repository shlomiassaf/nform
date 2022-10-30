import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NFormArrayComponent, NFormArrayDirective, ForFormArrayDirective, NFormComponent, NFormPinComponent } from './components/index';
import {
  NFormOverrideDirective,
  NFormControlDirective,
  NFormControlOutletDirective,
  NFormDirective,
  PblExplodeChildFormPipe
} from './directives/index';
import { NFormFactoryService } from './services/index';

import { FORM_CONTROL_COMPONENT } from './constants';
import { DefaultRenderer } from './types/index';

@NgModule({
  declarations: [
    NFormDirective,
    NFormOverrideDirective,
    NFormControlDirective,
    NFormControlOutletDirective,
    NFormArrayComponent,
    NFormArrayDirective,
    ForFormArrayDirective,
    NFormPinComponent,
    NFormComponent,
    PblExplodeChildFormPipe,
  ],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [
    NFormDirective,
    NFormOverrideDirective,
    NFormControlDirective,
    NFormControlOutletDirective,
    NFormArrayComponent,
    NFormArrayDirective,
    ForFormArrayDirective,
    NFormPinComponent,
    NFormComponent,
    PblExplodeChildFormPipe,
  ]
})
export class PblNFormModule {
  /**
   * Registers the module with and required services and with the default form control renderer.
   */
  static forRoot(formComponent: DefaultRenderer): ModuleWithProviders<PblNFormModule> {
    return {
      ngModule: PblNFormModule,
      providers: [
        NFormFactoryService,
        { provide: FORM_CONTROL_COMPONENT, useValue: formComponent }
      ]
    };
  }

  /**
   * Registers the module with the default form control renderer.
   * Use this when adding to child modules which requires a different renderer.
   */
  static forChild(formComponent: DefaultRenderer): ModuleWithProviders<PblNFormModule> {
    return {
      ngModule: PblNFormModule,
      providers: [
        { provide: FORM_CONTROL_COMPONENT, useValue: formComponent }
      ]
    };
  }
}
