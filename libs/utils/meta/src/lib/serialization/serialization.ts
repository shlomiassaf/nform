import { Constructor } from '@pebula/utils';
import { SerializationFactory, targetStore, BaseSerializer, BaseDeserializer } from '@pebula/utils/meta/internal';
import { Model } from '../decorators/model';
import { directMapper } from './direct-mapper';
import { serializeTargetMeta, deserializeTargetMeta } from './mapping/index';

@Model({ resName: 'InternalPlainObject' })
class PlainObject {}

/**
 * Serialize a class instance into a plain object.
 * @param mapper
 * @param instance
 * @param type optional, if not set taken from instance.constructor
 * @returns
 */
export function serialize<T, Z>(serializer: BaseSerializer, target: Z & Constructor<T>): any;
export function serialize<T, Z>(mapper: SerializationFactory, instance: T, target?: Z & Constructor<T>): any;
export function serialize(mapper: SerializationFactory | BaseSerializer, instanceOrTarget: any, target?: Constructor<any>): any {
  if (mapper instanceof BaseSerializer) {
    const meta = targetStore.getTargetMeta(instanceOrTarget);
    if (meta) {
      return serializeTargetMeta(meta, mapper);
    }
  } else {
    const meta = targetStore.getTargetMeta(target || instanceOrTarget.constructor);
    if (meta) {
      return serializeTargetMeta(meta, mapper.serializer(instanceOrTarget));
    }
  }
}

/**
 * Automatically serialize an instance.
 * This method will serialize an instance by first trying to locate the target using the `constructor` function.
 * If a target is found and if it's a model target (i.e. ModelMetadata) it will try to get the mapper assign for that
 * model.
 *
 * If no target, model or mapper was found it will use the fallbackMapper mapper provided, or `directMapper`
 * if no fallback is provided provided.
 *
 * Note that when provided a fallback mapper, make sure it is able to serialize unknown targets. (plain objects)
 */
export function autoSerialize(instance: any, fallbackMapper?: SerializationFactory): any {
  const tMeta = targetStore.getTargetMeta(instance.constructor as any);
  const mapper = (tMeta && tMeta.hasModel && tMeta.model().mapper) || fallbackMapper || directMapper;
  return serialize(mapper, instance);
}

/**
 * De-serialize a plain object into a the provided instance or, when no instance is provided, to a new instance.
 */
export function deserialize<T, Z extends Constructor<T>>(deserializer: BaseDeserializer<T, Z>, instance?: T): T;
export function deserialize<T, Z>(mapper: SerializationFactory, plainObject: any, type: Z & Constructor<T>, instance?: T): T;
export function deserialize(mapper: SerializationFactory | BaseDeserializer, plainObject?: any, type?: any, instance?: any): any {
  let deserializer: BaseDeserializer;
  if (mapper instanceof BaseDeserializer) {
    instance = plainObject;
    deserializer = mapper;
  } else {
    deserializer = mapper.deserializer(plainObject, type);
  }

  if (targetStore.hasTarget(deserializer.sourceType)) {
    const meta = targetStore.getTargetMeta(deserializer.sourceType);
    const result: any = instance || meta.model().factory(deserializer.isCollection);

    deserializeTargetMeta(meta, deserializer, result);
    return result;
  } else {
    const meta = targetStore.getTargetMeta(PlainObject);
    const result: any = instance || deserializer.isCollection ? [] : {};
    deserializeTargetMeta(meta, deserializer, result, true);
    return result;
  }
}

/**
 * Automatically de-serialize an object to/into an instance.
 * This method will de-serialize an object by first trying to locate a model (i.e. ModelMetadata) for the target.
 * If a model is found it will try to get the mapper assign for that model.
 *
 * If no model or mapper was found it will use the fallbackMapper mapper provided, or `directMapper`
 * if no fallback is provided provided.
 *
 */
export function autoDeserialize<T, Z>(plainObject: any, type: Z & Constructor<T>, instance: any = null, fallbackMapper?: SerializationFactory): T {
  const tMeta = targetStore.getTargetMeta(type);
  const mapper = (tMeta && tMeta.hasModel && tMeta.model().mapper) || fallbackMapper || directMapper;
  return deserialize(mapper, plainObject, type, instance);
}

/**
 * Performs a deep clone to the resource using serialization and deserialization, which means that all rules apply (i.e @Exclude)
 *
 * @param resource the resource (instance) to clone
 * @param serializationFactory Optional, The [[SerializationFactory]] to use, defaults to [[directMapper]].
 */
export function clone<T>(resource: T, serializationFactory?: SerializationFactory): T {
  return autoDeserialize(
    autoSerialize(resource, serializationFactory),
    resource.constructor as any,
    null,
    serializationFactory
  );
}
