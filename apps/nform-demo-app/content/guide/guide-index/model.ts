import { Validators } from '@angular/forms';
import { FormModel, FormProp } from '@pebula/nform';

@FormModel()
export class UIDeveloper {
  @FormProp({
    required: true,
    vType: 'number',
    label: 'Year Of Birth',
    validators: Validators.compose([Validators.min(1900), Validators.max(new Date().getFullYear())])
  })
  yearOfBirth: number;

  @FormProp({
    required: true,
    vType: 'radio',
    label: 'Gender',
    data: {
      options: [
        { value: 'male', label: 'MALE' },
        { value: 'female', label: 'FEMALE' },
        { value: 'other', label: 'OTHER' },
      ]
    },
  })
  gender: 'male' | 'female' | 'other';

  @FormProp({
    vType: 'select',
    label: 'Framework',
    data: {
      options: [
        { value: 'angular' },
        { value: 'react' },
        { value: 'vue' },
        { value: 'ember' },
        { value: 'knockout' },
        { value: 'other' }
      ]
    },
  })
  framework: 'angular' | 'react' | 'vue' | 'ember' | 'knockout' | 'other';
}
