import {
  targetStore,
  MetaClass,
  TypeMetadata,
  ExcludeMetadata,
  PropMetadata,
  RelationMetadata,
  PropMetadataArgs, ExcludeMetadataArgs, RelationMetadataArgs, TypeMetadataArgs, // DO NOT REMOVE - READ BELOW
} from '@pebula/metap/internal';

/*
We need to do some funky stuff for angular compiler...
If we wont, the output d.ts files will be messed up
For example:
export const Prop = MetaClass.decorator(PropMetadata, true);

WILL BECOME IN "d.ts"

export declare const Prop: (def?: import("../../../../../dist/@pebula/metap/internal/pebula-metap-internal").PropMetadataArgs) => (target: any, propertyKey?: string | number | symbol, descOrIndex?: number | PropertyDescriptor) => any;

This will happen because ngc doesn't know how properly get the symbol declaration so it fallbacks to the import style....
*/

/**
 * @propertyDecorator instance
 * @param def
 */
export const Prop = MetaClass.decorator(PropMetadata, true);

/**
 * @propertyDecorator instance
 * @param def
 */
export const Exclude = MetaClass.decorator(ExcludeMetadata, true);

/**
 * @propertyDecorator instance
 * @param def
 */
export const Relation = MetaClass.decorator(RelationMetadata, true);

/**
 * @propertyDecorator instance
 * @param def
 */
export const Type = MetaClass.decorator(TypeMetadata);

/**
 * @propertyDecorator instance
 */
export function Identity(): Function {
  return (target: Object, key: TdmPropertyKey) => {
    targetStore.getTargetMeta(<any>target.constructor).model().identity = key;
  };
}
