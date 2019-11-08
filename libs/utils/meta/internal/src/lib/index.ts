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
  MetaClassInstanceDetails,
  array,
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
  ModelMetadata,
  targetStore
} from './metadata/index';

export {
  SerializationFactory,
  SerializerContext, PoClassPropertyMap,
  BaseDeserializer,
  BaseSerializer,
  PlainObjectMapper,
} from './serialization';

export { ModelClassCollection, ModelClass, ModelClassBase } from './model/index';

// tslint:disable-next-line:no-namespace
declare global {
  type TdmPropertyKey = string | number | symbol;
}
