import {
  ChangeDetectorRef,
  Directive,
  Input,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
} from '@angular/core';

import { NFormControlTemplateContext, NFormRecordRef } from '../nform/index';
import type { NFormComponent } from '../components/nform/nform.component';
import { NFormComponentToken } from '../constants';

/**
 * An container/wrapper used to project the user-define renderer.
 * NFormControlDirective is much like `NgComponentOutlet`, they both do the same job.
 *
 * NFormControlDirective is more specific to the use case, it accepts {@link NFormRecordRef}
 * as input and renders a component that it gets from the DI.
 * @internal
 */
@Directive({ selector: '[nFormControl]' })
export class NFormControlDirective {
  public readonly nFormCmp: NFormComponent<any>;

  get nFormControl(): NFormRecordRef {
    return this.render;
  }

  @Input()
  set nFormControl(value: NFormRecordRef) {
    if (this.render === value) {
      return;
    }
    this.render = value;

    this.vcRef.clear();
    const outlet = this.nFormCmp.getOutlet(value);
    this.vcRef = outlet ? outlet.vcRef : this.defaultVCRef;
    this.vcRef.clear();

    if (outlet && outlet.tRef) {
      this.defaultVCRef.clear();
      const $implicit: NFormControlTemplateContext = <any>{};
      this.nFormCmp.nForm.bindRenderingData($implicit, value);
      this.defaultVCRef.createEmbeddedView(outlet.tRef, { $implicit });
    }

    if (value) {
      const override = this.nFormCmp.getOverride(value);
      if (override) {
        const $implicit: NFormControlTemplateContext = <any>{};
        this.nFormCmp.nForm.bindRenderingData($implicit, value);
        this.vcRef.createEmbeddedView(override.template, { $implicit }).detectChanges();
      } else {
        const injector = this.defaultVCRef.injector;
        const resolver = injector.get(ComponentFactoryResolver);
        const component = this.nFormCmp.getComponentRenderer(value);
        const componentFactory = resolver.resolveComponentFactory(component);
        this.cmpRef = this.defaultVCRef.createComponent<NFormControlTemplateContext>(componentFactory, this.defaultVCRef.length, injector);
        this.nFormCmp.nForm.bindRenderingData(this.cmpRef.instance, value);
        if (typeof this.cmpRef.instance.nFormOnControlContextInit === 'function') {
          this.cmpRef.instance.nFormOnControlContextInit();
        }
        if (outlet) {
          this.cmpRef.hostView.detectChanges();
          this.vcRef.insert(this.defaultVCRef.detach());
        }
      }
    }
  }

  private render: NFormRecordRef;
  private cmpRef: ComponentRef<NFormControlTemplateContext>;
  private vcRef: ViewContainerRef;

  constructor(private defaultVCRef: ViewContainerRef, private cdr: ChangeDetectorRef, @Inject(NFormComponentToken) nFormCmp: any) {
    this.vcRef = defaultVCRef;
    this.nFormCmp = nFormCmp;
  }
}
