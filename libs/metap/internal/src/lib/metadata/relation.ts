import { Constructor } from '@pebula/utils';
import { BaseMetadata, DecoratorInfo, MetaClass } from '../fw';
import { targetStore } from './target-store';

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
  // onCreated: () => {
  //   targetStore.on.processType((target: Constructor<any>) => {
  //     const meta = targetStore.getTargetMeta(target);
  //     meta.getValues(RelationMetadata).forEach(relation => {
  //       const prop = meta.getCreateProp(relation.decoratorInfo);
  //       prop.setRelationship(relation);

  //       // if the fk is a different key, attach a reference to the foreign key PropMetadata (and create 1 if not there)
  //       if (relation.name !== relation.foreignKey) {
  //         meta.getCreateProp(relation.foreignKey).foreignKeyOf = prop;
  //       }
  //     });
  //   });
  // }
})
export class RelationMetadata extends BaseMetadata {
  foreignKey: string;

  constructor(obj: RelationMetadataArgs | undefined, info: DecoratorInfo) {
    super(info);

    this.foreignKey = (obj && obj.foreignKey) || (info.name as any);
  }
}

// to make it easy on generics later
// declare module '../fw/metadata-framework/meta-class' {
//   module MetaClass {
//     function get(target: typeof RelationMetadata): MetaClassMetadata<RelationMetadataArgs, RelationMetadata>;
//   }
// }
