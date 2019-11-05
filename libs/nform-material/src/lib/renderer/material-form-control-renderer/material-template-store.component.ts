import { ViewEncapsulation, Component, ViewChild, TemplateRef } from '@angular/core';
import { FormElementType, NFormRecordRef } from '@pebula/nform';

import {MaterialStoreTemplateContext, TemplateStore } from './material-store-template-context';

const VALID_INPUTS = [
  'email',
  'month',
  'number',
  'password',
  'search',
  'tel',
  'text',
  // 'date',
  // 'datetime-local',
  // 'time',
  'url',
  'week'
];

/*
      IMPORTANT NOTE !!!

      ALL methods on `MaterialTemplateStoreComponent` are static, not instance methods!
      This component is only created ONCE throughout the entire app.
 */

/**
 * A "singleton" component that does never meet a view that has one purpose which is to be a store for templates
 * so each control renderer does not need to use queries and store templates within it's core template.
 *
 * For more information see https://github.com/angular/angular/issues/15275
 * TODO: When angular`s IVY renderer is the default renderer try using it for dynamic templates instead of a component
 */
@Component({
  selector: 'material-template-store',
  templateUrl: './material-template-store.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MaterialTemplateStoreComponent implements TemplateStore {
  // TODO: All queries are dynamic because they we're quickly migrated into the safe option, need to check if they can be static.
  @ViewChild('boolean', { read: TemplateRef, static: false }) boolean: TemplateRef<MaterialStoreTemplateContext>;
  @ViewChild('slideToggle', { static: false }) slideToggle: TemplateRef<MaterialStoreTemplateContext>;
  @ViewChild('slider', { static: false }) slider: TemplateRef<MaterialStoreTemplateContext>;
  @ViewChild('radio', { static: false }) radio: TemplateRef<MaterialStoreTemplateContext>;
  @ViewChild('textarea', { static: false }) textarea: TemplateRef<MaterialStoreTemplateContext>;
  @ViewChild('select', { static: false }) select: TemplateRef<MaterialStoreTemplateContext>;
  @ViewChild('chips', { static: false }) chips: TemplateRef<MaterialStoreTemplateContext>;
  @ViewChild('date', { static: false }) date: TemplateRef<MaterialStoreTemplateContext>;
  @ViewChild('input', { static: false }) input: TemplateRef<MaterialStoreTemplateContext>;
  @ViewChild('childForm', { static: false }) childForm: TemplateRef<MaterialStoreTemplateContext>;
  @ViewChild('formArray', { static: false }) formArray: TemplateRef<MaterialStoreTemplateContext>;

  private customTemplates: {
    [name: string]: TemplateRef<MaterialStoreTemplateContext>;
  } = {};

  registerTemplate(name: keyof FormElementType, templateRef: TemplateRef<MaterialStoreTemplateContext>): void {
    this.customTemplates[name] = templateRef;
  }

  getTemplate(item: NFormRecordRef): TemplateRef<MaterialStoreTemplateContext> {
    if (this.customTemplates[item.vType]) {
      return this.customTemplates[item.vType];
    } else if (item.isArray) {
      return this.formArray;
    } else if (item.isChildForm) {
      return this.childForm;
    } else {
      if (VALID_INPUTS.indexOf(item.vType) > -1) {
        return this.input;
      } else {
        return this[item.vType];
      }
    }
  }
}
