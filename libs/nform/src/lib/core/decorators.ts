import { MetaClass } from '@pebula/metap/internal';
import {
  FormPropMetadata,
  FormModelMetadata,
  FormModelMetadataArgs, FormPropMetadataArgs,  // DO NOT REMOVE - READ BELOW
} from './metadata/index';

/*
 We need to do some funky stuff for angular compiler...
 If we wont, the output d.ts files will be messed up
 For example:
 export const FormProp = MetaClass.decorator(FormPropMetadata, true);

 WILL BECOME IN "d.ts"

 export declare const FormProp: (def?: import("./metadata").FormPropMetadataArgs<"none" | "form">) => (target: any, propertyKey?: string | number | symbol, descOrIndex?: number | PropertyDescriptor) => any;

 This will happen because ngc doesn't know how properly get the symbol declaration so it fallbacks to the import style....

 There's also another issue, since FormPropMetadataArgs has <T>, angular will automatically set the T
 resulting in:

 export declare const FormProp: (def?: FormPropMetadataArgs<"none" | "form">) => (target: any, propertyKey?: string | number | symbol, descOrIndex?: number | PropertyDescriptor) => any;

*/

export const FormModel: (def?: FormModelMetadataArgs) => ClassDecorator = MetaClass['decorator'](FormModelMetadata, true);
// export const FormModel = MetaClass.decorator(FormModelMetadata, true);

export const FormProp: (def?: FormPropMetadataArgs) => PropertyDecorator = MetaClass['decorator'](FormPropMetadata, true);
// export const FormProp = MetaClass.decorator(FormPropMetadata, true);
