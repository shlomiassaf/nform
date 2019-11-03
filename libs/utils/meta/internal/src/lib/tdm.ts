export {
  errors,
  Errors,
  TransformDir,
  TransformFn,
  TransformStrategy,
  NamingStrategyConfig,
  LazyInit,
  DualKeyMap,
  SetExt,
  KeySet,
  MapExt,
  MetadataAllowOn,
  setMetaHelper,
  MetaClassRegisterHelpers,
  MetaClassExtendHelpers,
  BaseMetadata,
  BaseParamMetadata,
  DecoratorInfo,
  TargetEvents,
  lazyRef,
  reflection,
  ProxyHostMetadataArgs,
  MetaClassMetadataArgs,
  MetaClassMetadata,
  MetaClass,
  MetadataClassStatic,
  MetadataCurriedCreate,
  MetaClassInstanceDetails
} from './fw/index';

export {
  ModelMetadataArgs,
  TypeDefinition,
  TypeMetadataArgs,
  PropMetadataArgs,
  RelationMetadataArgs,
  ExcludeMetadataArgs,
  TypeMetadata,
  PropMetadata,
  ExcludeMetadata,
  RelationMetadata,
  TargetStore,
  TargetMetadata,
  targetStore
} from './metadata/index';

export {
  directMapper,
  TransformationError,
  DirectSerializeMapper,
  DirectDeserializeMapper,
  MapperFactory,
  DeserializeMapper,
  SerializeMapper,
  PropertyContainer,
  PoClassPropertyMap,
  transformValueOut,
  PlainObjectMapper
} from './mapping/index';

export { TDMCollection, TDMModel, TDMModelBase } from './model/index';

export { Model, ModelMetadata, processModel } from './add/model/index';

import './add/target-store';
import { initMapping } from './add/mapping';
initMapping();
import './add/mapping'; // we need this for d.ts export, the 2 rows above are not set in d.ts)

// tslint:disable-next-line:no-namespace
declare global {
  type TdmPropertyKey = string | number | symbol;
}
