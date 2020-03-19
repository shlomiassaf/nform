import { Directive, Input, TemplateRef } from '@angular/core';

import { FormElementType } from '../types/index';
import { NFormControlTemplateContext } from '../nform/nform';
import { ControlSelectorBase } from './control-selector-base';

export interface NFormOverrideContext {
  $implicit: NFormControlTemplateContext;
}

/**
 * A directive that allows override the default renderer for a form control name.
 *
 * @example
 *
 * ```html
 * <pbl-nform #df [model]="data.user" [exclude]="['remotePassword']">
 *   <md-input-container *nFormOverride="'localUser'; let ctx" [formGroup]="ctx.fGroup" >
 *     <input type="password" [formControl]="ctx.fControl" mdInput [placeholder]="ctx.item.label">
 *   </md-input-container>
 * </pbl-nform>
 * ```
 *
 */
@Directive({
  selector: '[nFormOverride]',
  exportAs: 'nFormOverride'
})
export class NFormOverrideDirective extends ControlSelectorBase {
  @Input('nFormOverride') controlName: string | string[];
  @Input('nFormOverrideVType') vType: keyof FormElementType | Array<keyof FormElementType>;

  constructor(public template: TemplateRef<NFormOverrideContext>) {
    // tslint:disable-line
    super();
  }
}
