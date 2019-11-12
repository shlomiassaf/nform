import { Constructor } from '@pebula/utils';
import { BaseMetadata, DecoratorInfo, MetaClass } from '../fw';
import { targetStore } from './target-store';
import { PropMetadata } from './prop';

export interface RelationMetadataArgs {
  /**
   * The foreign key (property name) that points to the id of the resource belonged to.
   * If not set, the current property name is used.
   *
   * For example, on a Customer object, if the foreign key is customerId and you would like to use
   * the "customer" property, set the foreignKey to "customerId"
   */
  foreignKey?: string;
}

// @dynamic
@MetaClass<RelationMetadataArgs, RelationMetadata>({
  allowOn: ['member'],
  extend: 'mergeMap',
  // Its possible to set @Relation() without @Prop(), so make sure to create one if not set by the user.
  onCreated: () => {
    targetStore.on.processType((target: Constructor<any>) => {
      const meta = targetStore.getTargetMeta(target);

      for (const relation of meta.getValues(RelationMetadata)) {
        const prop = PropMetadata.getCreateProp(meta, relation.decoratorInfo);
        RelationMetadata.setRelationship(prop, relation);

        // if the fk is a different key, attach a reference to the foreign key PropMetadata (and create 1 if not there)
        if (relation.name !== relation.foreignKey) {
          PropMetadata.getCreateProp(meta, relation.foreignKey).foreignKeyOf = prop;
        }
      }
    });
  }
})
export class RelationMetadata extends BaseMetadata {

  static setRelationship(prop: PropMetadata, relation: RelationMetadata): void {
    if (!prop.type.isGetter) {
      if (!prop.type.ref || prop.type.ref === Object || prop.type.ref === Array) {
        throw new Error(`Property ${prop.decoratorInfo.name.toString()} with relation but without a type, please set a type.`);
      }
    }

    prop.relation = relation;
  }

  foreignKey: string;

  constructor(obj: RelationMetadataArgs | undefined, info: DecoratorInfo) {
    super(info);
    this.foreignKey = (obj && obj.foreignKey) || (info.name as any);
  }
}

// to make it easy on generics later
declare module '../fw/metadata-framework/meta-class' {
  module MetaClass {
    function get(target: typeof RelationMetadata): MetaClassMetadata<RelationMetadataArgs, RelationMetadata>;
  }
}
