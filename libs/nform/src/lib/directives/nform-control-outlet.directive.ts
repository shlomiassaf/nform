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
  @Input('nformControlOutletDynForm') dynForm: import('../components/nform/nform.component').NFormComponent;
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
    if ('dynForm' in changes) {
      if (changes.dynForm.previousValue) {
        this.dynForm.detachControlOutlet(this);
      }
      if (this.dynForm) {
        this.dynForm.attachControlOutlet(this);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.dynForm) {
      this.dynForm.detachControlOutlet(this);
    }
  }
}
