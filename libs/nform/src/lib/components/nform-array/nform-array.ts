
import { ComponentFactoryResolver, ViewContainerRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { NForm, NFormRecordRef, NFormControlTemplateContext } from '../../nform/index';
import { NFormComponent } from '../nform/nform.component';

export abstract class NFormArray implements OnChanges {
  nFormCmp: NFormComponent;
  fArray: FormArray;
  fGroup: FormGroup;
  item: NFormRecordRef;
  nForm: NForm<any>;
  abstract vcRef: ViewContainerRef;

  private ready: boolean = false;

  constructor(private cfr: ComponentFactoryResolver, nFormCmp: NFormComponent<any>) {
    if (nFormCmp) {
      this.nFormCmp = nFormCmp;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nForm || changes.fArray || changes.item || changes.fGroup) {
      if (
        this.ready !==
        !!(
          this.nForm &&
          this.fArray &&
          this.fGroup &&
          this.item &&
          this.item.isArray
        )
      ) {
        this.ready = !this.ready;
        this.updateControls();
      }
    }
  }

  private updateControls(): void {
    this.vcRef.clear();
    if (this.ready) {
      const component = this.nFormCmp.getComponentRenderer(this.item);
      const componentFactory = this.cfr.resolveComponentFactory(component);

      for (let childControl of this.fArray.controls) {
        for (let childItem of this.item.children) {
          const c = childItem.resolveFormArrayChild(childControl);
          const override = this.nFormCmp.getOverride(childItem);
          if (override) {
            const $implicit: NFormControlTemplateContext = <any>{
              item: childItem,
              fGroup: this.fGroup,
              nForm: this.nForm,
              [c instanceof FormArray ? 'fArray' : 'fControl']: c
            };
            this.vcRef.createEmbeddedView(override.template, { $implicit });
          } else {
            const cmpRef = this.vcRef.createComponent<NFormControlTemplateContext>(componentFactory, this.vcRef.length);
            const { instance } = cmpRef;
            instance.item = childItem;
            instance.fGroup = this.fGroup;
            instance.nForm = this.nForm;
            if (c instanceof FormArray) {
              instance.fArray = c;
            } else {
              instance.fControl = <any>c;
            }
            if (typeof instance.tdmOnControlContextInit === 'function') {
              instance.tdmOnControlContextInit();
            }
          }
        }
      }
    }
  }
}
