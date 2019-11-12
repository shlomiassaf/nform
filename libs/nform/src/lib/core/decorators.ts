import { MetaClass } from '@pebula/metap/internal';
import { FormModelMetadata, FormPropMetadata } from './metadata/index';

export const FormModel =  MetaClass.decorator(FormModelMetadata, true);

export const FormProp =  MetaClass.decorator(FormPropMetadata, true);
