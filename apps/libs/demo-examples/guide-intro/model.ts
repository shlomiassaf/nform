import { Validators } from '@angular/forms';
import { Model, FormModel, FormProp } from '@pebula/nform';

@Model()
@FormModel({ model: false })
export class UIDeveloper {
  @FormProp({
    required: true,
    render: {
      vType: 'number',
      label: 'Year Of Birth'
    },
    validators: Validators.compose([Validators.min(1900), Validators.max(new Date().getFullYear())])
  })
  yearOfBirth: number;

  @FormProp({
    required: true,
    render: {
      vType: 'radio',
      label: 'Gender',
      data: {
        options: [
          { value: 'male', label: 'MALE' },
          { value: 'female', label: 'FEMALE' },
          { value: 'other', label: 'OTHER' },
        ]
      }
    }
  })
  gender: 'male' | 'female' | 'other';

  @FormProp({
    render: {
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
      }
    }
  })
  framework: 'angular' | 'react' | 'vue' | 'ember' | 'knockout' | 'other';
}
