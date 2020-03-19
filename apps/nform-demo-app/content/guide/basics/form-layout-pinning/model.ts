import { FormModel, FormProp } from '@pebula/nform';

@FormModel()
export class Hero {
  @FormProp({
    vType: 'number',
    label: 'Hero ID'
  })
  id: number;

  @FormProp({
    required: true,
    vType: 'text',
    label: 'Hero Name'
  })
  name: string;

  @FormProp({
    vType: 'date',
    label: 'Hero Birth'
  })
  birth: string;

  @FormProp({
    vType: 'select',
    label: 'Super Power',
    data: {
      multiple: true,
      options: [
        { value: 'selfHealing', label: 'Self Healing' },
        { value: 'flying', label: 'Flying' },
        { value: 'cloaking', label: 'Cloaking' },
        { value: 'cloning', label: 'Cloning' },
        { value: 'invisibility', label: 'Invisibility' }
      ]
    }
  })
  superPower: 'selfHealing' | 'flying' | 'cloaking' | 'cloning' | 'invisibility';

  @FormProp({
    required: true,
    vType: 'textarea',
    label: 'Bio',
    data: {
      autoSize: false,
      minRows: 3,
      maxRows: 5
    }
  })
  bio: string;
}
