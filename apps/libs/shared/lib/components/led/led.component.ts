import { Component, Input, ChangeDetectionStrategy, SimpleChanges, OnChanges } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'pbl-led',
  templateUrl: './led.component.html',
  styleUrls: [ './led.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PblLedComponent implements OnChanges {
  @Input() color: 'red' | 'blue' | 'yellow' | 'green';
  @Input() disabled: BooleanInput;
  @Input() blink: BooleanInput;

  ngOnChanges(changes: SimpleChanges): void {
    if ('disabled' in changes) {
      this.disabled = coerceBooleanProperty(this.disabled);
    }
    if ('blink' in changes) {
      this.blink = coerceBooleanProperty(this.blink);
    }
  }
}
