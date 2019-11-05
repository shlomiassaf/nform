import { Type, Injector, ComponentFactoryResolver } from '@angular/core';
import { PageFileAsset } from '@pebula-internal/webpack-markdown-pages';

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


  beforeRenderPage(page?: PageFileAsset): void {}

  beforeRenderComponent<T extends MarkdownDynamicComponentPortal>(instance: T, cmp: Type<T>, element: HTMLElement): void {
  }
}
