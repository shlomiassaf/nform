import { Type, Injector, ComponentFactoryResolver } from '@angular/core';

import { MarkdownDynamicComponentPortal } from '../markdown-dynamic-component-portal';

export interface MarkdownPageViewerRenderInstructions {
  selector: string;
  cmp: Type<any>;
  identAttr: string;
  injector?: Injector;
  componentFactoryResolver?: ComponentFactoryResolver;
}
export class MarkdownPageViewerRenderAdapter {

  readonly dynamicComponents: ReadonlyArray<MarkdownPageViewerRenderInstructions>;


  beforeRenderComponent<T extends MarkdownDynamicComponentPortal>(instance: T, cmp: Type<T>, element: HTMLElement): void {
  }
}
