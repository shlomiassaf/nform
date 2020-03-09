import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  Component,
  Input,
  Inject,
  EventEmitter,
  Output,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnDestroy,
  Type,
  TemplateRef,
  IterableChanges,
  IterableDiffer,
  IterableDiffers,
  KeyValueDiffer,
  KeyValueDiffers,
  KeyValueChangeRecord,
  ElementRef,
  ViewChild,
  Renderer2,
  AfterViewInit,
  DoCheck,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  forwardRef,
} from '@angular/core';
import { AbstractControl, FormGroup, ControlContainer } from '@angular/forms';

import { isFunction } from '@pebula/utils';
import { FormElementType, ControlRenderer, DefaultRenderer, DefaultRendererMap } from '../../types/index';
import { coerceBooleanProperty, PropNotifyHandler, PropChanges  } from '../../utils/index';
import { NFormComponentToken, FORM_CONTROL_COMPONENT } from '../../constants';
import { NForm, NFormRecordRef } from '../../nform/index';
import { NFormOverrideDirective, NFormOverrideContext, NFormControlOutletDirective } from '../../directives/index';
import { NFormFactoryService } from '../../services/index';
import { BeforeRenderEventHandler, RendererEvent, NFormValuesChange } from '../../events/index';
import { NFormControlContainer } from './nform-control-container';

export interface NFormRecordRefInternal extends NFormRecordRef {
  /**
   * Used as flag for show/hide (true is hide)
   * @internal
   */
  _dSelf: boolean;
  /**
   * Used as flag for show/hide of parent (true is hide)
   * @internal
   */
  _dParent: boolean;
}

type StateKeys = 'filter' | 'disabled' | 'hidden';

export function nFormComponentSelfFactory(nform: any) { return nform; }
export function nFormComponentSelfFactory1(nform: any) { return new NFormControlContainer(nform) as any; }

/**
 * Allow rendering a form using @tdm/ngx-dynamic-forms and MaterialFormControlRenderer
 */
@Component({
  selector: 'pbl-nform, form[pbl-nform]',
  templateUrl: './nform.component.html',
  providers: [
    {
      provide: NFormComponentToken,
      useFactory: nFormComponentSelfFactory,
      deps: [forwardRef(() => NFormComponent)],
    },
    {
      provide: ControlContainer,
      useFactory: nFormComponentSelfFactory1,
      deps: [forwardRef(() => NFormComponent)],
    },
  ],
})
export class NFormComponent<T = any> implements PropNotifyHandler,
                                                AfterContentInit,
                                                AfterViewInit,
                                                OnChanges,
                                                DoCheck,
                                                OnDestroy {
  /**
   * The [[NForm]] instance that is used by the component
   * > This is created after a model is set.
   */
  nForm: NForm<any>;

  /**
   * The [[FormGroup]] instance used by [[NForm]].
   * Available after [[NForm]] instance is created.
   */
  get form(): FormGroup | undefined {
    return this.nForm && this.nForm.form;
  }

  @ContentChildren(NFormOverrideDirective) overrides: QueryList<NFormOverrideDirective>;

  @ViewChild('internalFormElement', { static: false }) internalFormElRef: ElementRef;

  /**
   * The CSS class of the `form` element which is also the container of all rendered items.
   */
  @Input() formClass: string;

  /**
   * Real time binding between the form and the model.
   *
   * When true, every value change event emitted from the from will trigger and update to the model.
   *
   * When false (default) the form data model and the model instance are not bound, to update the model
   * you need to invoke the NForm.commitToModel
   *
   * > A hot bind is one way, from form update to the model.
   *
   * @default false
   */
  @Input() hotBind: boolean;

  @Input() get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    value = coerceBooleanProperty(value);
    if (value !== this._disabled) {
      this._disabled = value;
      this.onDisableChange();
    }
  }
  private _disabled = false;

  /**
   * Pass through for @angular/forms `ngNativeValidate` attribute that enables native browser validation
   *
   */
  @Input() get ngNativeValidate(): any {
    return this._ngNativeValidate;
  }

  set ngNativeValidate(value: any) {
    // tslint:disable-line
    const native = value != null && `${value}` !== 'false';
    if (this._ngNativeValidate !== native) {
      this._ngNativeValidate = native;
      this.setNativeValidation();
    }
  }

  /**
   * The instance and type (class) to dynamically render as form.
   * You can set the model using 3 possible formats:
   *   1. The model's instance, in this case the type is the constructor property (instance.constructor)
   *   2. A tuple of [Model Instance, Model Type]
   *   3. An instance of [[NForm]], the model an type are taken from [[NForm]], the component will not
   *   create anew instance of [[NForm]] and will use the one provided.
   *   Setting this value is only possible when a previous NForm is not set.
   *
   * @example
   * `<pbl-nform [model]="user"></pbl-nform>`
   * `<pbl-nform [model]="[user, User]"></pbl-nform>`
   *
   */
  @Input() get model(): T | NForm<T> | [T, Type<T>] {
    return this._model;
  }
  set model(value: T | NForm<T> | [T, Type<T>]) {
    if (value !== this._model) {
      this._model = value;
      this.onModelChange();
    }
  }
  private _model: T | NForm<T> | [T, Type<T>];

  /**
   * Setting the dynamic form as a slave of another dynamic form.
   * You can this feature to split forms of complex models.
   *
   * A form in slave mode has very limited functionality, it can only filter controls and override controls.
   * All other options (hidden state, disabled state, hot binding etc..) are not supported in the slave and should be
   * handled in the master.
   *
   * Make sure you are not rendering the same controls more then once. A group of master and all of it's slave should
   * render only one instance of a control across the whole group. If you render the same control multiple times
   * you will get unexpected behavior and the form controls will get out of sync.
   *
   * You can set any number of slaves.
   * You can not change or remove the master.
   * You can not set a model when using slave mode.
   *
   * A slave does not handle form state, it only handles internal rendering and this is why only filter and
   * override are supported, hidden and disabled are derived by the form state...
   * @param nFormCmp
   */
  @Input() set slaveOf(nFormCmp: NFormComponent<T>) {
    if (this.slaveMode === true) {
      return; // TODO: warn? error? slave mode can only be set once.
    } else if (this.slaveMode === false) {
      throw new Error('Slave mode does not work when setting a model');
    }
    this.nForm = nFormCmp.nForm;
    this.instance = nFormCmp.instance;
    this.type = nFormCmp.type;
    this.slaveMode = true;
    this.rendererEvent$.subscribe(e => nFormCmp.rendererEvent$.emit(e));
  }

  /**
   * An array of form control names, each name in this array will used when filtering the controls.
   *
   * The filter operation is set by the `filterMode` property.
   *
   * When the filter mode is "exclude" all fields are rendered by default but each name in this array will not be
   * rendered (excluded).
   *
   * When the filter mode is "include" all fields are not rendered by default but each name in this array will be
   * rendered (included).
   *
   * The default filtering mode is `exclude`
   *
   * Supports deep paths using dot notation.
   * The end result in the UI is identical to `hiddenState` however excluded fields behave like `*ngIf`, they are never
   * rendered, hidden fields are rendered but not displayed.
   */
  @Input() filter: string[];

  /**
   * Defines the filtering mode.
   *
   * There are 2 modes:
   *   - include: All fields will not render by default, only those defined in the filter will render.
   *   - exclude: All fields will render by default, only those defined in the filter will not render.
   *
   * The default filtering mode is `exclude`
   */
  @Input() filterMode: 'include' | 'exclude' = 'exclude';

  /**
   * An array of form control names, each name in this array will be disabled.
   * Supports deep paths using dot notation.
   */
  @Input() disabledState: string[];

  /**
   * An array of form control names, each name in this array will be hidden (display: none).
   * Supports deep paths using dot notation.
   *
   * From the UI perspective, the end result for `filter` and `hiddenState` is identical, however there is a difference.
   * Fields filtered out by `filter` are similar to `*ngIf`, they are added / removed when toggled. Hidden fields are
   * rendered but does not displayed. This has an effect on performance, animation, etc...
   */
  @Input() hiddenState: string[];

  /**
   * Event emitted when a form value changes.
   *
   * When a change occurs in a child property of a flattened property (nested objects) the `key` property in the change
   * represents a path (not the name) to the value from the root object.
   *
   * > Note that each event is emitted synchronously and all listeners will run in sequence. While listeners run new
   * change events are blocked which means you can change form values without the event firing again. If you do want
   * a re-fire change the value async.
   */
  @Output() valueChanges = new EventEmitter<NFormValuesChange>();

  /**
   * Event emitted before rendering form controls.
   *
   * The event object contains a reference to all active records.
   *
   * Use this event to modify form rendering records (metadata) before they are rendered.
   * For example, given a `select` form control, you can use this event to create dynamic, ad-hoc, select options.
   *
   * ```html
   *  <pbl-nform [model]="model" (beforeRender)="beforeRender($event)">
   * ```
   *
   * ```ts
   * @Component({ ... })
   * export class MyComponent {
   *   beforeRender(event: BeforeRenderEventHandler) {
   *     if ('state' in event.records) {
   *       event.records.state.options = [ { value: 'X', label: 'Y' } ] // more...
   *     }
   *   }
   * }
   * ```
   * You can modify all the of properties in {@link NFormRecordRef}... the render type, order and more.
   *
   * ### Asynchronous rendering logic
   * There are scenarios where the modification logic is asynchronous, for example, populating the
   * options (options) of a form control from a remote server
   *
   * ```ts
   * @Component({ ... })
   * export class MyComponent {
   *   beforeRender(event: BeforeRenderEventHandler) {
   *     if ('state' in event.records) {
   *       let resolve, p = new Promise( (res, rej) => { resolve = res; });
   *
   *       event.async(p); // notify to use async logic
   *
   *       // do some async stuff...
   *       setTimeout(() => {
   *         event.records.state.options = [ { value: 'X', label: 'Y' } ] // more...
   *         resolve();
   *       }, 1000);
   *     }
   *   }
   * }
   * ```
   * > You can use the `renderState` event to reflect asynchronous rendering in the UI.
   */
  @Output() beforeRender = new EventEmitter<BeforeRenderEventHandler>();

  /**
   * Event emitted when the rendering state changes.
   * True states that the form is rendering, False states and idle, the form is rendered.
   *
   * Since rendering in angular is synchronous a True rendering state can only occur when implementing
   * async logic within `beforeRender` event {@link BeforeRenderEventHandler}
   *
   * Use this event to reflect (UX/UI) in that the form is not ready.
   */
  @Output() renderState: Observable<boolean>;

  /**
   * An notification stream dedicated to the renderer.
   *
   * A renderer implementation can use this stream to emit notification to the host of a dynamic form.
   *
   * For example, instead of a child form being displayed by the renderer the renderer can emit a
   * [[ChildFormEditRendererEvent]] event and let the host display the child form.
   *
   * There are several fixed event and a custom event, see [[RendererEvent]] for more details.
   */
  @Output() rendererEvent: Observable<RendererEvent>;

  /**
   * A dictionary of all the active records that will get rendered, active records does not include records that were filtered out.
   */
  records: { [path: string]: NFormRecordRef } = {};

  /**
   * A collection of all the active records that will get rendered, active records does not include records that were filtered out.
   * @internal
   */
  _records = new BehaviorSubject<NFormRecordRefInternal[]>([]);

  readonly formElRef: ElementRef<HTMLFormElement>;
  /** When true, the internal <form> element is used */
  readonly _internalForm: boolean;

  private instance: T;
  private type: Type<T>;
  private subscriptions: Subscription[] = [];
  private freezeValueChanges: boolean;
  private valueDiffer: KeyValueDiffer<string, any>;
  private stateDiffer: Partial<Record<StateKeys, IterableDiffer<string>>> = {};
  private afterInit: boolean;
  private rendering$ = new BehaviorSubject<boolean>(false);
  private _ngNativeValidate: any = false;
  private slaveMode: boolean;
  private outlets: Set<NFormControlOutletDirective> = new Set<NFormControlOutletDirective>();
  private overrideMap = new Map<NFormRecordRef, NFormOverrideDirective>();
  private outletMap = new Map<NFormRecordRef, NFormControlOutletDirective>();
  private wildOverride: NFormOverrideDirective;
  private rendererEvent$ = new EventEmitter<RendererEvent>();
  private recordRefs: NFormRecordRef[];
  private controlRenderer: DefaultRendererMap;
  private defaultControlRenderer: ControlRenderer;

  /**
   * Indicates the number of update() calls that are running/queued
   * A number n that is > 1 does not mean the update will run n times, it will run one more time only.
   */
  private pendingUpdates: number = 0;
  /**
   * Overrides that are injected by code (addOverride) and not by content projection
   */
  private codeOverrides: NFormOverrideDirective[] = [];

  constructor(private nFormService: NFormFactoryService,
              @Inject(FORM_CONTROL_COMPONENT) controlRenderer: DefaultRenderer,
              private kvDiffers: KeyValueDiffers,
              private itDiffers: IterableDiffers,
              private renderer: Renderer2,
              elRef: ElementRef<HTMLElement>) {
    this.renderState = this.rendering$.asObservable();
    this.rendererEvent = this.rendererEvent$.asObservable();

    if (isFunction(controlRenderer)) {
      this.controlRenderer = {};
      this.defaultControlRenderer = controlRenderer;
    } else {
      this.controlRenderer = controlRenderer;
      this.defaultControlRenderer = this.controlRenderer['*'];
      if (!this.defaultControlRenderer) {
        throw new Error('Default control renderer not set.');
      }
    }

    if (elRef.nativeElement.nodeName.toLowerCase() === 'form') {
      Object.defineProperty(this, 'formElRef', { value: elRef, configurable: false, writable: false, enumerable: false });
    } else {
      Object.defineProperty(this, '_internalForm', { value: true, configurable: false, writable: false, enumerable: false });
      Object.defineProperty(this, 'formElRef', { get: () => this.internalFormElRef, configurable: false, enumerable: false });
    }
  }

  getComponentRenderer(rd: NFormRecordRef): ControlRenderer {
    return rd.isArray
      ? this.controlRenderer['[]'] || this.defaultControlRenderer
      : this.controlRenderer[rd.vType] || this.defaultControlRenderer;
  }

  attachControlOutlet(outlet: NFormControlOutletDirective): void {
    this.outlets.add(outlet);
  }

  detachControlOutlet(outlet: NFormControlOutletDirective): boolean {
    return this.outlets.delete(outlet);
  }

  /**
   * Redraw the controls of the form.
   * This will fire the (renderState) event and trigger (beforeRender) event's for each render record.
   *
   * If you wish to invoke a silent update call the markAsChanged() method on a [[NFormRecordRef]] instance, this
   * will mark it for change detection but will not fire the events.
   */
  redraw(): void;
  redraw(returnPromise: boolean): Promise<void>;
  redraw(returnPromise?: boolean): Promise<void> | void {
    this.update();
    if (returnPromise === true) {
      if (this.rendering$.getValue() === false) {
        return Promise.resolve();
      } else {
        return <any> this.renderState.pipe(filter(state => !state)).toPromise();
      }
    }
  }

  getOverride(item: NFormRecordRef): NFormOverrideDirective | undefined {
    return this.overrideMap.get(item);
  }

  getOutlet(item: NFormRecordRef): NFormControlOutletDirective | undefined {
    return this.outletMap.get(item);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filterMode) {
      const prevIncluded = changes.filterMode.previousValue === 'include';
      const currIncluded = changes.filterMode.currentValue === 'include';
      if (currIncluded !== prevIncluded) {
        this.update();
      }
    }

    if (changes.filter) {
      this.onStateChange('filter', changes.filter);
    }

    if (changes.disabledState) {
      this.onStateChange('disabled', changes.disabledState);
    }

    if (changes.hiddenState) {
      this.onStateChange('hidden', changes.hiddenState);
    }
  }

  ngDoCheck() {
    if (this.filter && this.stateDiffer.filter) {
      const diff = this.stateDiffer.filter.diff(this.filter);
      if (diff) {
        this.handleDiff('filter', diff);
      }
    }

    if (this.disabledState && this.stateDiffer.disabled) {
      const diff = this.stateDiffer.disabled.diff(this.disabledState);
      if (diff) {
        this.handleDiff('disabled', diff);
      }
    }

    if (this.hiddenState && this.stateDiffer.hidden) {
      const diff = this.stateDiffer.hidden.diff(this.hiddenState);
      if (diff) {
        this.handleDiff('hidden', diff);
      }
    }
  }

  ngAfterContentInit(): void {
    this.recordRefs = this.nForm.renderData;

    this.afterInit = true;
    this.updateOverrides();

    const s = this.overrides.changes.subscribe(() => this.updateOverrides());
    this.subscriptions.push(s);
  }

  ngAfterViewInit(): void {
    if (this._ngNativeValidate === true) {
      this.setNativeValidation();
    }
  }

  ngOnDestroy(): void {
    let subs: Subscription;
    while ((subs = this.subscriptions.pop())) {
      // tslint:disable-line
      subs.unsubscribe();
    }
    this.rendererEvent$.complete();
    this.rendering$.complete();
    this.beforeRender.complete();
    this.valueChanges.complete();
  }

  /**
   * Returns the form control for a given key
   * @param key
   * @returns
   */
  getControl(key: string): AbstractControl | null {
    return this.nForm.get(key);
  }

  /**
   * API to manually add field override templates, use this if you want to apply overrides but can not
   * set the content projection in the template.
   */
  addOverride(query: { controlName?: string | string[]; vType?: keyof FormElementType | Array<keyof FormElementType>; },
              tRef: TemplateRef<NFormOverrideContext>,
              update: boolean = true): void {
    const d = new NFormOverrideDirective(tRef);
    d.controlName = query.controlName;
    d.vType = query.vType;
    d.syncQuery();
    if (d.isCatchAll && !d.vType) {
      this.wildOverride = d;
      this.wildOverride['__CUSTOM_ADD_OW__'] = true;
    } else {
      this.codeOverrides.push(d);
    }

    if (update) {
      this.update();
    }
  }

  emitRendererEvent(event: RendererEvent): void {
    this.rendererEvent$.emit(event);
  }

  onPropChange(ri: NFormRecordRef, changes: PropChanges<NFormRecordRef>): void {
    let markAsChanged: boolean;
    if (changes.required || changes.validators || changes.asyncValidators) {
      const control = this.nForm.get(ri.fullName);
      const validators = ri.getValidators();
      control.setValidators(validators[0]);
      control.setAsyncValidators(validators[1]);
      markAsChanged = true;
    }
    if (changes.vType || changes.label) {
      markAsChanged = true;
    }
    if (changes.ordinal) {
      this.update();
    }
    if (markAsChanged) {
      ri.markAsChanged();
    }
  }

  private onModelChange(): void {
    const model = this.model;

    if (this.slaveMode) {
      throw new Error('Setting a model is not allowed when in slave mode.');
    }
    this.slaveMode = false;

    if (model instanceof NForm) {
      if (this.nForm) {
        if (this.nForm === model) {
          return;
        } else {
          throw new Error(
            'Can not set a model using a NForm instance when a previous NForm instance exist'
          );
        }
      }
      this.instance = model.model;
      this.type = model.type;
    } else if (Array.isArray(model)) {
      this.instance = model[0];
      this.type = model[1];
    } else {
      this.instance = model;
      this.type = <any>model.constructor;
    }

    this.valueDiffer = undefined;

    if (!this.nForm) {
      this.nForm =
        model instanceof NForm
          ? model
          : this.nFormService.create(this.instance, this.type);

      const formValue = this.nForm.form.getRawValue();
      this.valueDiffer = this.kvDiffers.find(formValue).create();
      this.valueDiffer.diff(formValue); // for some reason objects do not commit the 1st time
      if (this.disabled) {
        this.form.disable();
      }
      this.applyFormListener();
    } else {
      this.nForm.setContext(this.instance, this.type);
    }
    this.update();
  }

  private onDisableChange(): void {
    if (this.form) {
      if (this.disabled) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    }
  }

  private updateOverrides(): void {
    const match = this.overrides.find(ow => ow.isCatchAll && !ow.vType);
    // we update the wildOverride, but we check if the old wildOverride was added using addOverride method (custom)
    // if so (no match and old added manually) we will leave it.
    // we do that because it's most likely we won't find template overrides when custom is set
    // it also means template wins over custom
    if (
      match ||
      !this.wildOverride ||
      this.wildOverride['__CUSTOM_ADD_OW__'] !== true
    ) {
      this.wildOverride = match;
    }

    this.update();
  }

  private update(notRoot?: boolean): void {
    if (!this.nForm || !this.afterInit) {
      return;
    }

    if (this.pendingUpdates > 0) {
      this.pendingUpdates += 1;
      return;
    }

    // we emit the rendering state async
    const recordsReady: Array<Promise<any>> = [
      new Promise(resolve =>
        setTimeout(() => {
          this.emitRenderingState(true);
          resolve();
        })
      )
    ];

    const records: NFormRecordRefInternal[] = [];
    const recordsMap: { [path: string]: NFormRecordRef; } = (this.records = {});
    const recordsPromiseSetter = done => recordsReady.push(done);
    this.overrideMap.clear();
    this.outletMap.clear();

    const overrides = this.overrides.toArray().concat(this.codeOverrides);
    const outlets = Array.from(this.outlets.values());
    const hiddenState = this.hiddenState && this.hiddenState.slice();
    const filterMatch = this.filterMode === 'include';
    const filter = this.filter && this.filter.slice();

    const processRecords = (rd: NFormRecordRefInternal) => {
      const fullPath: string = rd.fullName;
      if (
        !filter ||
        this.isStaticPathContainsPath(filter, fullPath) === filterMatch
      ) {
        const override =
          overrides.find(o => o.isMatching(rd)) || this.wildOverride;
        if (override) {
          this.overrideMap.set(rd, override);
        }

        const outlet = outlets.find(o => o.isMatching(rd));
        if (outlet) {
          this.outletMap.set(rd, outlet);
        }

        // update hidden state of each item
        setHidden(
          rd,
          !!(
            hiddenState && this.isStaticPathContainsPath(hiddenState, fullPath)
          )
        );
        recordsMap[fullPath] = rd;
        records.push(rd);
      }
    };

    this.recordRefs.forEach(processRecords);

    const renderEvent = new BeforeRenderEventHandler(recordsMap, recordsPromiseSetter, !notRoot);
    this.beforeRender.emit(renderEvent);

    this.pendingUpdates += 1;
    Promise.all(recordsReady)
      // tslint:disable-next-line
      .catch(err => {}) // we swallow errors, these should be handled by the user
      .then(() => {
        this.pendingUpdates -= 1;

        if (this.pendingUpdates > 0) {
          this.pendingUpdates = 0;
          this.update(true);
          return;
        } else {
          this.records = recordsMap;
          Object.freeze(recordsMap);
          this._records.next(records.sort((a, b) => a.ordinal - b.ordinal));
          this.emitRenderingState(false);
        }
      });
  }

  /**
   * Check's if an array of paths that might be static or partial are part of the provided full static path.
   * For example: pathList: ['address'], fullPath: 'address.street' -> true
   *
   * TODO: This is called from the update() method and can be improved.
   * because it use a NFormRecordRef it has the full path as an array so we can flag levels so next call to deep
   * a nested item will fail on the spot cause it's first level was blocked.
   * e.g. if user blocked 'address' and next item is 'address.name' or 'address.x.y.z' it will fail on the spot because
   * all of the address object is blocked. Current state is full check for all children of address.
   */
  private isStaticPathContainsPath(pathList: string[], fullPath: string): boolean {
    const idx = pathList.findIndex(
      p => p === fullPath || fullPath.indexOf(p + '.') === 0
    );
    if (idx > -1) {
      const nextChar = fullPath[pathList[idx].length];
      return !nextChar || nextChar === '.';
    }
    return false;
  }

  private emitRenderingState(state: boolean): void {
    if (this.rendering$.getValue() === !state) {
      this.rendering$.next(state);
    }
  }

  private applyFormListener(): void {
    let freeze: boolean;
    this.nForm.propNotifyHandler = this;
    const s = this.nForm.form.valueChanges.subscribe(formValue => {
      const diff = this.valueDiffer.diff(formValue);
      // we diff before freeze check so we won't pile changes to next step.
      if (freeze || this.freezeValueChanges) {
        return;
      }
      if (diff) {
        const arr: NFormValuesChange = [];
        diff.forEachChangedItem(change => {
          if (this.hotBind === true) {
            this.instance[change.key] = change.currentValue;
          }
          if (this.isFlattenedProp(change.key)) {
            arr.push(...this.drillDownChange(change, [change.key]));
          } else {
            arr.push(change);
          }
        });
        if (arr.length > 0) {
          freeze = true;
          this.valueChanges.next(arr);
          freeze = false;
        }
      }
    });
    this.subscriptions.push(s);
  }

  private isFlattenedProp(key: string, level: number = 0): boolean {
    return this.nForm.renderData.some(
      r => !!r.flattened && r.flattened[level] === key
    );
  }

  /**
   * Drills down a change in an object of a `flattened` property and returns the changes in the object.
   * The drill down is recursive so nested flattened properties will reflect the changes as well.
   *
   * The `key` of each change will be in the dot notation format.
   *
   * ## Why?
   * The form `valueChanges` stream will emit changes to controls on the first level, if a nested control
   * (i.e FormGroup or FormArray) has child that changed the stream will not reflect that and will only emit an event
   * for the top-level control itself.
   *
   * This resolution is an issue when using flattened rendering.
   * While UI shows a flat form the underlying structure is left intact and each flattened property gets a `FormGroup`
   * attached to it, emitting [[NFormComponent.valueChanges]] events for flattened properties will have low
   * resolution because the change event will include the top-level key only and the current/previous values will be
   * the top-level objects themselves and not the actual child value that changed.
   *
   * To enhance the resolution this method will drill down the value of a change to find the internal changes in the
   * object and return them, this is done by diffing the previous value with the current value.
   * Each drill down is recursive so a flattened object with a nested flattened object will also get proper resolution.
   *
   * You must call this function with a change for a property that is known to be defined as flattened and include
   * it in the `path` parameter as the first (and only) item.
   *
   * > Make sure not to confuse flattened nested objects with nested objects that are not defined as flattened by the
   * user, those will not apply here.
   * @param change
   * @param path
   */
  private drillDownChange(change: KeyValueChangeRecord<string, any>,
                          path: Array<string | number>): Array<KeyValueChangeRecord<string, any>> {
    const result: Array<KeyValueChangeRecord<string, any>> = [];
    if (change.previousValue) {
      const differ = this.kvDiffers.find(change.previousValue).create();
      differ.diff(change.previousValue);
      const diff = differ.diff(change.currentValue);
      if (diff) {
        diff.forEachChangedItem((c: any) => {
          if (this.isFlattenedProp(c.key, path.length)) {
            result.push(...this.drillDownChange(<any>c, path.concat([c.key])));
          } else {
            c = Object.create(c, {
              deep: { value: true },
              key: { value: path.join('.') + `.${c.key}` }
            });
            result.push(c);
          }
        });
      }
    } else if (change.currentValue) {
      change = Object.create(change, {
        deep: { value: true },
        key: { value: path.join('.') + `.${change.key}` }
      });
      result.push(change);
    }
    return result;
  }

  private setNativeValidation(): void {
    if (this.formElRef) {
      if (this._ngNativeValidate === true) {
        this.renderer.removeAttribute(
          this.formElRef.nativeElement,
          'novalidate'
        );
      } else {
        this.renderer.setAttribute(
          this.formElRef.nativeElement,
          'novalidate',
          ''
        );
      }
    }
  }

  private onStateChange(type: StateKeys, state: SimpleChange): void {
    let differ: IterableDiffer<string> = this.stateDiffer[type];
    if (!state.currentValue && differ) {
      const diff = differ.diff([]);
      if (diff) {
        this.handleDiff(type, diff);
      }
      differ = undefined;
    } else if (!state.previousValue && state.currentValue) {
      differ = this.itDiffers.find(state.currentValue).create();
    }
    this.stateDiffer[type] = differ;
  }

  private handleDiff(type: StateKeys, diff: IterableChanges<string>): void {
    switch (type) { // tslint:disable-line
      case 'disabled':
        this.freezeValueChanges = true;
        diff.forEachAddedItem(record => this.getControl(record.item).disable());
        diff.forEachRemovedItem(record =>
          this.getControl(record.item).enable()
        );
        this.freezeValueChanges = false;
        break;
      case 'filter':
        this.update();
        break;
      case 'hidden':
        diff.forEachAddedItem(record => {
          const item = this.findRenderInstructionByKey(record.item);
          if (item && setHidden(item, true)) {
            this.update();
          }
        });
        diff.forEachRemovedItem(record => {
          const item = this.findRenderInstructionByKey(record.item);
          if (item && setHidden(item, false)) {
            this.update();
          }
        });
        break;
    }
  }

  /**
   * Find's a NFormRecordRef using the provided static property path.
   * Note that a property path might point to a virtual NFormRecordRef, such that does not actually render in the UI
   * but has children that does.
   */
  private findRenderInstructionByKey(dotProperty: string): NFormRecordRefInternal | undefined {
    for (let c of this._records.value) {
      const fullPath = c.fullName;
      if (fullPath.indexOf(dotProperty) > -1) {
        const nextChar = fullPath[dotProperty.length];
        if (!nextChar) {
          return c;
        } else if (nextChar === '.') {
          let len = fullPath.substr(dotProperty.length + 1).split('.').length;
          while (len-- > 0) {
            c = <any>c.parent;
          }
          return c;
        }
      }
    }
  }
}

/**
 * Set's the state of the display property in the NFormRecordRefInternal.
 * Take's into consideration parent's state when computing the child's state.
 * returns `true` when the operation included changes in children
 */
function setHidden(ri: NFormRecordRefInternal, value: boolean): boolean {
  if (ri.hidden !== value) {
    ri._dSelf = value;
    ri.hidden = ri._dSelf || ri._dParent;
    ri.markAsChanged();
    return tryRunOnChildren(ri, ri._dSelf);
  }
  return false;
}

function setHiddenParent(ri: NFormRecordRefInternal, value: boolean): void {
  ri._dParent = value;
  ri.hidden = ri._dSelf || ri._dParent;
  ri.markAsChanged();
  tryRunOnChildren(ri, value);
}

function tryRunOnChildren(ri: NFormRecordRefInternal, value: boolean): boolean {
  const children = ri.isVirtual
    ? ri.virtualChildren
    : ri.isArray ? ri.children : undefined;
  if (children) {
    children.forEach(child => setHiddenParent(<any>child, value));
    return true;
  }
}
