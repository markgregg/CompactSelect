import { Choice } from "./choice";

export interface DisplayProps<T extends Choice | object | string> {
  title: string;
  text: string;
  selected: T[];
  choicesShown: boolean;
  selectType?: 'standard' | 'dropdown' | 'switch';
  disabled?: boolean;
}
