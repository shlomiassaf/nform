import { FormModel, FormProp } from '@pebula/nform';
import { Validators } from '@angular/forms';

@FormModel()
export class Hero {
  @FormProp({
    vType: 'number',
    label: 'Hero ID',
    validators: Validators.compose([ Validators.min(1000), Validators.max(999999) ])
  })
  id: number;

  @FormProp({
    required: true,
    vType: 'text',
    label: 'Hero Name',
  })
  name: string;
}
