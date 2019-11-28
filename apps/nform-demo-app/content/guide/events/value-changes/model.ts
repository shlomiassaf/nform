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
    vType: 'boolean',
    label: 'Has Tracking Device'
  })
  hasTracking: boolean;

  @FormProp({
    vType: 'slideToggle',
    label: 'Double Agent'
  })
  doubleAgent: boolean;

  @FormProp({
    vType: 'slider',
    label: 'BMI Index',
    data: { min: 1, max: 35 }
  })
  bmi: number;

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
    forceObjectType: true,
    vType: 'select',
    label: 'Hobbies',
    data: {
      multiple: true,
      options: [
        'Baseball',
        'Basketball',
        'Buildi',
        'Cosplay',
        'Soccer',
        'Spelunkering',
        'Storm Chasing',
        'Wrestling',
        'Writing',
        'Yoga'
      ].map( value => ({value})),
    }
  })
  hobbies: Array<'selfHealing' | 'flying' | 'cloaking' | 'cloning' | 'invisibility'>;

  @FormProp({
    forceObjectType: true,
    vType: 'chips',
    label: 'Chips',
    data: {
      removable: true,
      addOnBlur: true,
    }
  })
  chips: string[];

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
