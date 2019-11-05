import { FormElementType } from '@pebula/nform';

declare module '@pebula/nform/lib/types/form-element-type' {
  interface FormElementType {
    text: never;
    number: { min?: number; max?: number };
    boolean: never;
    date: {
      min?: Date;
      max?: Date;
      filter?: (date: Date) => boolean;
      startView?: 'year' | 'month';
      startAt?: Date;
    };

    radio: { options: Array<{ value: any; label?: string }> };
    select: { options: Array<{ value: any; label?: string }>; multiple?: true };
    chips: { removable?: boolean; selectable?: boolean; addOnBlur?: boolean; separatorKeysCodes?: any[]; },
    password: never;
    slider: { min?: number; max?: number };
    slideToggle: never;
    textarea: { autoSize?: boolean; minRows?: number; maxRows?: number };
  }
}
