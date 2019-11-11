import { SerializerContext } from './context';
import { PlainObjectMapper } from './plain-object-mapper';

export interface SerializerClass<TTarget = any, TSource = any> {
  new (source: TSource | any[], plainMapper?: PlainObjectMapper): Serializer<TTarget, TSource>;
}

export interface Serializer<TTarget = any, TSource = any> {
  serialize(context: SerializerContext): TTarget;
}

/**
 * Represents the contract a Serializer needs to implements.
 * A Serializer should handle both a collection and a single item and should be able to identify them.
 *
 * Since Serialization transforms a KNOWN document to an UNKNOWN document the serializer is gets
 * free control over the output.
 * The library provides the instance and a container of property metadata for the instance and the
 * serializer should do the rest.
 *
 * Since the output schema is now known to the library the whole process is managed by the serializer.
 * The library helps with metadata.
 */
export abstract class BaseSerializer<TTarget = any, TSource = any> {
  protected plainMapper: PlainObjectMapper;

  constructor(public source: TSource | TSource[], plainMapper?: PlainObjectMapper) {
    this.plainMapper = plainMapper || new PlainObjectMapper();
  }

  abstract serialize(container: SerializerContext): TTarget;
}
