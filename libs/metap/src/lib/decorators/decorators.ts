import { isString, Constructor } from '@pebula/utils';
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
  TypeDefinition, PropMetadataArgs, RelationMetadataArgs, // leave for angular AOT compiler.
} from '@pebula/metap/internal';

declare module '@pebula/metap/internal/lib/metadata/target-metadata' {
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

export const Exclude = MetaClass.decorator(ExcludeMetadata, true); // for Angular AOT

/**
 * @propertyDecorator instance
 * @param def
 */
export const Relation = (() => {
  // Its possible to set @Relation() without @Prop(), so make sure to create one if not set by the user.
  targetStore.on.processType((target: Constructor<any>) => {
    const meta = targetStore.getTargetMeta(target);

    for (const relation of meta.getValues(RelationMetadata)) {
      const prop = meta.getCreateProp(relation.decoratorInfo);
      prop.setRelationship(relation);

      // if the fk is a different key, attach a reference to the foreign key PropMetadata (and create 1 if not there)
      if (relation.name !== relation.foreignKey) {
        meta.getCreateProp(relation.foreignKey).foreignKeyOf = prop;
      }
    }
  });

  return MetaClass.decorator(RelationMetadata, true);
})();

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
