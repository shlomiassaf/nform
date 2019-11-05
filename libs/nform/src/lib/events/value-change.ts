import { KeyValueChangeRecord } from '@angular/core';

/**
 * Represents a single change in a form.
 * This type is an alias of KeyValueChangeRecord<string, any>
 */
export interface NFormValueChange extends KeyValueChangeRecord<string, any> {
  /**
   * When true indicates that the `key` property contains a path and not a name, i.e it's a dot delimited path to a
   * property through nested object (or objects)
   */
  deep?: boolean;
}

/**
 * Represents a collection of changes in a form
 * This type is an alias of Array<KeyValueChangeRecord<string, any>> (NFormValueChange[])
 */
export type NFormValuesChange = NFormValueChange[];
