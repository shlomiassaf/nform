import { Component, Input, ViewContainerRef, OnInit } from '@angular/core';
import { ControlSelectorBase, NFormControlOutlet } from '../../directives/control-selector-base';
import { NFormComponent } from '../nform/nform.component';

@Component({
  selector: 'nform-pin',
  template: '',
  host: {
    'style': 'display: none;',
  }
})
export class NFormPinComponent<T = any> extends ControlSelectorBase implements OnInit, NFormControlOutlet {

  @Input() controlName: string | string[];

  constructor(public readonly vcRef: ViewContainerRef, private nFormCmp: NFormComponent<T>) {
    super();
  }

  ngOnInit(): void {
    this.nFormCmp.attachControlOutlet(this);
  }

  ngOnDestroy(): void {
    this.nFormCmp.detachControlOutlet(this);
  }
}
