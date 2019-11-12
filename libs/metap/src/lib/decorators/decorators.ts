import {
  targetStore,
  MetaClass,
  TypeMetadata,
  ExcludeMetadata,
  PropMetadata,
  RelationMetadata,
} from '@pebula/metap/internal';

/**
 * @propertyDecorator instance
 * @param def
 */
export const Prop = MetaClass.decorator(PropMetadata, true);

export const Exclude = MetaClass.decorator(ExcludeMetadata, true); // for Angular AOT

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
