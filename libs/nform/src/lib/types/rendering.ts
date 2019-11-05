import { Type } from '@angular/core';
import { FormElementType } from './form-element-type';
import { NFormControlTemplateContext } from '../nform/nform';

/**
 * A renderer component.
 */
export type ControlRenderer = Type<NFormControlTemplateContext>;

/**
 * A map of visual types and the default renderer component to use for the visual type.
 * To set a fallback/catch all component use '*' as the key.
 */
export type DefaultRendererMap = Partial<
  Record<keyof FormElementType | '*' | '[]', ControlRenderer>
>;

/**
 * Default renderer definition.
 * Can be a ControlRenderer or a DefaultRendererMap
 */
export type DefaultRenderer = ControlRenderer | DefaultRendererMap;
