import { take } from 'rxjs/operators';
import { Type, Injectable } from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { ContentChunkViewComponent, MarkdownDynamicComponentPortal, MarkdownPageViewerRenderAdapter, MarkdownPageViewerRenderInstructions } from '@pebula/apps/shared';
import { PblNformCreateNotifier } from '../pbl-nform-create-notify/pbl-nform-create-notify.directive';
import { PblExampleFormViewComponent } from './example-form-view.component';

const ALLOWED_INPUTS: Array<[string, (val: any) => any]> = [
  [ 'exampleStyle', String ],
  [ 'rightDrawerOpened', coerceNumberProperty ],
  [ 'jsonView', coerceBooleanProperty ],
  [ 'showSourceCode', coerceBooleanProperty ],
  [ 'noToolbar', coerceBooleanProperty ],
];

@Injectable()
export class MarkdownPageViewerFormRenderAdapter extends MarkdownPageViewerRenderAdapter {

  readonly dynamicComponents: ReadonlyArray<MarkdownPageViewerRenderInstructions> = [
    {
      selector: '[pbl-example-view]',
      cmp: PblExampleFormViewComponent,
      identAttr: 'pbl-example-view',
    },
    {
      selector: '[pbl-app-content-chunk]',
      cmp: ContentChunkViewComponent,
      identAttr: 'pbl-app-content-chunk',
    },
  ];

  constructor(private nformCreateNotifier: PblNformCreateNotifier) {
    super();
  }

  beforeRenderComponent<T extends MarkdownDynamicComponentPortal>(instance: T, cmp: Type<T>, element: HTMLElement): void {
    switch (cmp as any) {
      case PblExampleFormViewComponent:
        this.renderExampleView(instance as any, element);
        break;
      case ContentChunkViewComponent:
        this.renderContentChunkView(instance as any, element);
        break;
    }
  }

  protected renderExampleView(instance: PblExampleFormViewComponent, element: HTMLElement) {
    for (const [attr, factory] of ALLOWED_INPUTS) {
      if (element.hasAttribute(attr)) {
        instance[attr] = factory(element.getAttribute(attr))
      }
    }

    this.nformCreateNotifier.onCreate
      .pipe(take(1))
      .subscribe( nform => instance.setNform(nform) );
  }

  protected renderContentChunkView(instance: ContentChunkViewComponent, element: HTMLElement) {

  }
}
