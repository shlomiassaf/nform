export interface FormElementType {
  none: never;

  /**
   * A child form reference.
   * Set automatically when the [[FormPropMetadataArgs.childForm]] is set to true.
   */
  form: never;
}

/**
 * Holds global information, not form specific that apply to all control.
 * For example, setting a `flex` definition to layout controls using flex-box
 */
export interface FormElementTypeGlobals {

}
