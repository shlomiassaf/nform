import { InjectionToken } from '@angular/core';
import { NFormControlTemplateContext } from './nform/nform';

export const NFormComponentToken = new InjectionToken<import('./components/nform/nform.component').NFormComponent>('NFormComponent');

/**
 * A Token for the component that renders form controls
 */
export const FORM_CONTROL_COMPONENT = new InjectionToken<NFormControlTemplateContext>('NFormControlTemplateContext');
