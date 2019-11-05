import { TemplateRef } from '@angular/core';
import { NFormRecordRef, NFormControlTemplateContext, FormElementType } from '@pebula/nform';

export interface MaterialStoreInstance {
  editSingleChildForm(context: NFormControlTemplateContext): void;

  addToList(): void;

  editFromList(): void;

  removeFromList(): void;

  hasError(errorName: string, ctx: NFormControlTemplateContext): boolean;
}

export interface MaterialStoreTemplateContext {
  $implicit: NFormControlTemplateContext;
  showLabels?: boolean;
  self: MaterialStoreInstance;
}

export interface TemplateStore {
  registerTemplate(name: keyof FormElementType, templateRef: TemplateRef<MaterialStoreTemplateContext>): void;
  getTemplate(item: NFormRecordRef): TemplateRef<MaterialStoreTemplateContext>;
}
