import { isString } from '@pebula/utils';
import {
  targetStore,
  MetaClass,
  DecoratorInfo,
  TypeMetadata,
  TargetMetadata,
  ExcludeMetadata,
  ExcludeMetadataArgs,
  PropMetadata,
  RelationMetadata,
  TypeDefinition, // leave for angular AOT compiler.
  PropMetadataArgs, // leave for angular AOT compiler.
  RelationMetadataArgs, // leave for angular AOT compiler.
} from '@pebula/utils/meta/internal';

declare module '@pebula/utils/meta/internal/lib/metadata/target-metadata' {
  interface TargetMetadata<T, Z> {
    getCreateProp(info: DecoratorInfo | string): PropMetadata;
  }
}

/**
 * @propertyDecorator instance
 * @param def
 */
export const Prop = (() => {
  const Decor = MetaClass.decorator(PropMetadata, true);

  TargetMetadata.prototype.getCreateProp = function getCreateProp(info: DecoratorInfo | string): PropMetadata {
    const name = isString(info) ? info : info.name;

    if (!this.config.has(PropMetadata, name)) {
      Decor()(this.target.prototype, name);
    }

    return this.config.get(PropMetadata, name);
  };

  return Decor;
})();

/** @internal */
export let exclude: any = {};
exclude = MetaClass.decorator(ExcludeMetadata, true, 'classPropMethod'); // for Angular AOT

/**
 * @propertyDecorator instance
 */
export function Exclude(metaArgs?: ExcludeMetadataArgs): (target: Object | Function,
                                                          key?: TdmPropertyKey,
                                                          desc?: PropertyDescriptor) => any {
  return exclude(metaArgs) as any;
}

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
