import { take } from 'rxjs/operators';
import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  Input,
  Output,
  OnDestroy,
  EventEmitter,
  ElementRef,
  ViewContainerRef,
  Injector,
  NgZone,
  Type,
  Optional,
  HostListener,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal';
import { MetaService } from '@ngx-meta/core';

import { UnRx } from '@pebula/utils';
import { PageFileAsset } from '@pebula-internal/webpack-markdown-pages';
import { MarkdownDynamicComponentPortal } from '../markdown-dynamic-component-portal';
import { MarkdownPagesService } from '../../services/markdown-pages.service';
import { LocationService } from '../../services/location.service';
import { MarkdownPageContainerComponent } from '../markdown-page-container/markdown-page-container.component';
import { MarkdownPageViewerRenderAdapter, MarkdownPageViewerRenderInstructions } from './markdown-page-viewer-render-adapter';

@Component({
  selector: 'pbl-markdown-page-viewer',
  templateUrl: './markdown-page-viewer.component.html',
  styleUrls: ['./markdown-page-viewer.component.scss'],
  host: {
    class: 'markdown-body',
    '[class.no-parent-container]': '!hasContainer',
  },
})
@UnRx()
export class MarkdownPageViewerComponent implements OnDestroy {

  @Input() set documentUrl(url: string) { this.updateDocument(url); }
  @Output() contentRendered = new EventEmitter<void>();

  page: PageFileAsset;
  readonly hasContainer: boolean;

  private _portalHosts: DomPortalHost[] = [];

  constructor(private mdPages: MarkdownPagesService,
              private meta: MetaService,
              private locationService: LocationService,
              route: ActivatedRoute,
              private _elementRef: ElementRef,
              private _appRef: ApplicationRef,
              private _componentFactoryResolver: ComponentFactoryResolver,
              private _injector: Injector,
              private _viewContainerRef: ViewContainerRef,
              private _ngZone: NgZone,
              private renderAdapter: MarkdownPageViewerRenderAdapter,
              @Optional() container: MarkdownPageContainerComponent) {
    this.hasContainer = !!container;
    route.data.pipe(UnRx(this)).subscribe( data => {
      if (data.documentUrl) {
        this.updateDocument(data.documentUrl);
      }
    });
  }

  @HostListener('click', ['$event.target', '$event.button', '$event.ctrlKey', '$event.metaKey', '$event.altKey'])
  onClick(eventTarget: HTMLElement, button: number, ctrlKey: boolean, metaKey: boolean, altKey: boolean): boolean {
    // Deal with anchor clicks; climb DOM tree until anchor found (or null)
    let target: HTMLElement|null = eventTarget;
    while (target && !(target instanceof HTMLAnchorElement)) {
      target = target.parentElement;
    }
    if (target instanceof HTMLAnchorElement) {
      return this.locationService.handleAnchorClick(target, button, ctrlKey, metaKey);
    }

    // Allow the click to pass through
    return true;
  }

  private updateDocument(url: string) {
    this._clearLiveExamples();
    if (!url) {
      this.renderAdapter.beforeRenderPage();
      this._elementRef.nativeElement.innerHTML = '';
      return;
    }
    this.mdPages.getPage(url)
      .then( p => {
        this.page = p;
        this.renderAdapter.beforeRenderPage(p);
        this._elementRef.nativeElement.innerHTML = p.contents;

        if (typeof this._elementRef.nativeElement.getBoundingClientRect === 'function') {
          for (const dyn of this.renderAdapter.dynamicComponents) {
            this._loadComponents(dyn);
          }
        }

        this._ngZone.onStable.pipe(take(1)).subscribe(() => this.contentRendered.next());
      });
  }

  private _loadComponents<T extends MarkdownDynamicComponentPortal>(instructions: MarkdownPageViewerRenderInstructions) {
    let exampleElements = this._elementRef.nativeElement.querySelectorAll(`${instructions.selector}`);

    Array.prototype.slice.call(exampleElements).forEach((element: Element) => {
      const ident = element.getAttribute(instructions.identAttr);
      const containerClass = element.getAttribute('containerClass');
      const inputs = element.getAttribute('inputs');

      const cfr = instructions.componentFactoryResolver || this._componentFactoryResolver;
      const injector = instructions.injector || this._injector;
      const portalHost = new DomPortalHost(element, cfr, this._appRef, injector);
      const cmpPortal = new ComponentPortal(instructions.cmp, this._viewContainerRef, injector, cfr);
      const cmpRef = portalHost.attach(cmpPortal);

      if (inputs) {
        try {
          cmpRef.instance.inputParams = JSON.parse(inputs);
        } catch(err) { }
      }
      cmpRef.instance.componentName = ident;
      cmpRef.instance.containerClass = containerClass;

      this.renderAdapter.beforeRenderComponent(cmpRef.instance, instructions.cmp, element as HTMLElement);
      cmpRef.instance.render();
      cmpRef.changeDetectorRef.markForCheck();
      cmpRef.changeDetectorRef.detectChanges();
      this._portalHosts.push(portalHost);
    });
  }

  private _clearLiveExamples() {
    this._portalHosts.forEach(h => h.dispose());
    this._portalHosts = [];
  }

  ngOnDestroy(): void {
    this._clearLiveExamples();
  }
}
