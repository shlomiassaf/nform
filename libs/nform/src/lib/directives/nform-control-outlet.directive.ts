import {
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

import { FormElementType } from '../types';
import { NFormOverrideContext, ControlSelectorBase } from './nform-override.directive';

@Directive({
  selector: '[nformControlOutlet]',
  exportAs: 'nformControlOutlet'
})
export class NFormControlOutletDirective extends ControlSelectorBase implements OnChanges, OnDestroy {

  @Input('nformControlOutlet') controlName: string | string[];
  @Input('nformControlOutletNFormCmp') nFormCmp: import('../components/nform/nform.component').NFormComponent;
  @Input('nformControlOutletVType') vType: keyof FormElementType | Array<keyof FormElementType>;

  /**
   * @internal
   */
  _vcRef: ViewContainerRef;
  _tRef?: TemplateRef<NFormOverrideContext>;

  constructor(vcRef: ViewContainerRef, @Optional() tRef: TemplateRef<NFormOverrideContext>) {
    super();
    this._vcRef = vcRef;
    this._tRef = tRef;
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if ('nFormCmp' in changes) {
      if (changes.nFormCmp.previousValue) {
        this.nFormCmp.detachControlOutlet(this);
      }
      if (this.nFormCmp) {
        this.nFormCmp.attachControlOutlet(this);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.nFormCmp) {
      this.nFormCmp.detachControlOutlet(this);
    }
  }
}
