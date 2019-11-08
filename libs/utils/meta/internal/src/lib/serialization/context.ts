import { PropMetadata } from '../metadata/prop';
import { ExcludeMetadata } from '../metadata/exclude';

/**
 * Mappings between properties of a plain object to a class
 * @internal
 */
export interface PoClassPropertyMap {
  cls: TdmPropertyKey;
  obj: string;
  exclude?: ExcludeMetadata;
  prop?: PropMetadata;
}

export interface SerializerContext {
  target: any;

  forEach(keys: string[], cb: (pMap: PoClassPropertyMap) => void): void;

  /**
   * A forEach loop on all instructions including excluded instructions and properties not in "keys" but in metadata.
   * It is recommended to use "forEach" unless the mapper implementation has different transformation strategies.
   * @param keys
   * @param cb
   */
  forEachRaw(keys: string[], cb: (pMap: PoClassPropertyMap) => void): void;
}
