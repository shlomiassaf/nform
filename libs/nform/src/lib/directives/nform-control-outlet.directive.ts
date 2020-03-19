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
import { NFormOverrideContext } from './nform-override.directive';
import { ControlSelectorBase, NFormControlOutlet } from './control-selector-base';

@Directive({
  selector: '[nformControlOutlet]',
  exportAs: 'nformControlOutlet'
})
export class NFormControlOutletDirective extends ControlSelectorBase implements OnChanges, OnDestroy, NFormControlOutlet {

  @Input('nformControlOutlet') controlName: string | string[];
  @Input('nformControlOutletNFormCmp') nFormCmp: import('../components/nform/nform.component').NFormComponent;
  @Input('nformControlOutletVType') vType: keyof FormElementType | Array<keyof FormElementType>;

  constructor(public readonly vcRef: ViewContainerRef, @Optional() public readonly tRef?: TemplateRef<NFormOverrideContext>) {
    super();
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
