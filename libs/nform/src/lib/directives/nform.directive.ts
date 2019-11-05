import { Type, Input, Directive } from '@angular/core';

import { NForm } from '../nform/index';
import { NFormFactoryService } from '../services/index';

/**
 * A helper Directive to expose NForm within a template.
 *
 * This is an alternate method for create forms on a template. Instead of using an injected
 * NFormFactoryService instance to create instances of NForm you can use this directive.
 *
 * @example
 * ```ts
 * <div #nForm="nForm" [nForm]="user">
 *   <form [formGroup]="nForm.form" novalidate>
 *     <div *ngFor="let item of nForm.renderData; trackBy: nForm.trackBy" class="row">
 *       <div [ngSwitch]="item.vType" class="row">
 *         <input *ngSwitchCase="'boolean'" type='checkbox' [formControlName]="item.name">{{ item.label }} />
 *         <input *ngSwitchCase="'text'" type='text' [formControlName]="item.name">{{ item.label }} />
 *         <input *ngSwitchCase="'number'" type='number' [formControlName]="item.name">{{ item.label }} />
 *      </div>
 *   </form>
 * </div>
 * ```
 */
@Directive({
  selector: '[nForm]',
  exportAs: 'nForm'
})
export class NFormDirective<T> extends NForm<T> {
  @Input()
  set nForm(value: T | [T, Type<T>]) {
    const [instance, type] = Array.isArray(value)
      ? value
      : [value, <any>value.constructor];
    this.setContext(instance, type);
  }

  constructor(modelFormService: NFormFactoryService) {
    super(modelFormService);
  }
}
