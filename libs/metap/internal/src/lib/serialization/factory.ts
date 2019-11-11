import { Constructor } from '@pebula/utils';
import { BaseSerializer } from './serializer';
import { PlainObjectMapper } from './plain-object-mapper';
import { BaseDeserializer } from './deserializer';

export interface SerializationFactory {
  serializer(source: any, plainMapper?: PlainObjectMapper): BaseSerializer;
  deserializer<T, Z extends Constructor<T> = Constructor<T>>(source: any, sourceType: Z & Constructor<T>, plainMapper?: PlainObjectMapper): BaseDeserializer<T, Z>;
}
