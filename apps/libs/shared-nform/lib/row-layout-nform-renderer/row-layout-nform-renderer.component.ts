import { ChangeDetectionStrategy, Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { NFormComponent, NFormRecordRef, NForm, NFormControlTemplateContext } from '@pebula/nform';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'row-layout-nform-renderer',
  templateUrl: './row-layout-nform-renderer.component.html',
  styleUrls: [ './row-layout-nform-renderer.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PblRowLayoutNformRenderer implements NFormControlTemplateContext, OnChanges {
  @Input() custom: boolean;
  @Input() dynForm: NFormComponent;
  @Input() item: NFormRecordRef;
  @Input() nForm: NForm<any>;

  @Input() fArray: FormArray | undefined;
  @Input() fControl: FormControl | undefined;
  @Input() fGroup: FormGroup | undefined;

  /**
   * Allows setting the context using `NFormControlTemplateContext` directly.
   */
  @Input()
  set fromContext(value: NFormControlTemplateContext) {
    if ( value ) {
      Object.assign(this, value);
    }
  }

  ngOnChanges(change: SimpleChanges): void {
    if ( 'custom' in change ) {
      this.custom = coerceBooleanProperty(this.custom);
    }
  }
}
