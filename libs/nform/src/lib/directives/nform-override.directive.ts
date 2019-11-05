import { Directive, Input, TemplateRef, SimpleChanges, OnChanges } from '@angular/core';
import { isString } from '@pebula/utils';

import { FormElementType } from '../types';
import { NFormRecordRef } from '../nform/nform-record-ref';
import { NFormControlTemplateContext } from '../nform/nform';

export interface NFormOverrideContext {
  $implicit: NFormControlTemplateContext;
}

export class ControlSelectorBase implements OnChanges {
  controlName: string | string[];
  vType: keyof FormElementType | Array<keyof FormElementType>;

  /**
   * Returns true when the control name is catch all
   */
  get isCatchAll(): boolean {
    return this.controlName === '*';
  }

  protected filter = {
    names: [] as string[],
    vTypes: [] as Array<keyof FormElementType>
  };

  isMatching(rd: NFormRecordRef): boolean {
    return (
      (!this.vType || this.filter.vTypes.indexOf(rd.vType) > -1) &&
      (this.controlName &&
        (this.controlName === '*' || this.controlName.indexOf(rd.name) > -1))
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('controlName' in changes || 'vType' in changes) {
      this.syncQuery();
    }
  }

  syncQuery(): void {
    this.filter.names = Array.isArray(this.controlName)
      ? this.controlName
      : isString(this.controlName) ? [this.controlName] : [];

    this.filter.vTypes = Array.isArray(this.vType)
      ? this.vType
      : isString(this.vType) ? [this.vType] : [];
  }
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
  @Input('nFormOverrideVType')
  vType: keyof FormElementType | Array<keyof FormElementType>;

  constructor(public template: TemplateRef<NFormOverrideContext>) {
    // tslint:disable-line
    super();
  }
}
