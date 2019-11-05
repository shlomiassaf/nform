export interface FormElementType {
  none: never;

  /**
   * A child form reference.
   * Set automatically when the [[FormPropMetadataArgs.childForm]] is set to true.
   */
  form: never;
}
