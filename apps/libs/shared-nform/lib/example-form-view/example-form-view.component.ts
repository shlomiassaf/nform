import { debounceTime } from 'rxjs/operators';
import { Component, ContentChild, Input, SimpleChanges } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations'
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { UnRx } from '@pebula/utils';
import { ExampleViewComponent } from '@pebula/apps/shared';
import { AbstractControl } from '@angular/forms';
import { NFormComponent } from '@pebula/nform';

import * as hljs from 'highlight.js/lib/highlight';
hljs.registerLanguage('json', require(`highlight.js/lib/languages/json.js`));

@Component({
  selector: 'pbl-example-form-view',
  templateUrl: './example-form-view.component.html',
  styleUrls: ['./example-form-view.component.scss'],
  host: {
    '[class.example-style-flow]': 'exampleStyle === "flow"',
    '[class.example-style-toolbar]': '!noToolbar && exampleStyle === "toolbar"',
  },
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [
        style({transform: 'translateX(200%)'}),
        animate('200ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateX(200%)'}))
      ])
    ])
  ]
})
@UnRx()
export class PblExampleFormViewComponent extends ExampleViewComponent {

  form: AbstractControl;
  nFormCmp: NFormComponent;

  formJson: string;
  modelJson: string;
  showSpinner: boolean;

  @Input() noToolbar: boolean;
  @Input() rightDrawerOpened: boolean;
  @Input() jsonView: boolean;
  @Input() showSourceCode: boolean = false;

  ledBlinking: boolean;
  ledColor: 'red' | 'blue' | 'yellow' | 'green';

  render(): void {
    super.render({ provide: PblExampleFormViewComponent, useValue: this });
  }

  toggleJsonView(): void {
    this.jsonView = !this.jsonView;
    if (this.jsonView) {
      this.refreshJsonView();
    }
  }

  onCommitToModel(): void {
    this.nFormCmp.nForm.commitToModel();
    this.refreshJsonView();
  }

  ngOnChanges(change: SimpleChanges): void {
    if ('rightDrawerOpened' in change) {
      this.rightDrawerOpened = coerceBooleanProperty(this.rightDrawerOpened);
    }
  }

  setNform(nform: NFormComponent): void {
    this.nFormCmp = nform;
    this.form = nform.form;
    this.nFormCmp.valueChanges.pipe(debounceTime(150)).subscribe( v => this.refreshJsonView() );

    this.form.statusChanges.subscribe( status => {
      switch (status) {
        case 'VALID':
          this.ledColor = 'green';
          this.ledBlinking = false;
          break;
        case 'INVALID':
          this.ledColor = 'red';
          this.ledBlinking = true;
          break;
        case 'PENDING':
          this.ledColor = 'blue';
          this.ledBlinking = true;
          break;
        case 'DISABLED':
          this.ledColor = 'yellow';
          this.ledBlinking = false;
          break;
        default:
          this.ledColor = <any> '';
      }
    });
  }

  refreshJsonView(): void {
    if (this.jsonView) {
      this.formJson = hljs.highlightAuto(JSON.stringify(this.nFormCmp.form.getRawValue(), null, 2), ['json']).value;
      this.modelJson = hljs.highlightAuto(JSON.stringify(this.nFormCmp.nForm.model, null, 2), ['json']).value;
    }
  }
}
