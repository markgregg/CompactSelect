import { Choice } from "./choice";

export interface ChoiceProps<T extends Choice | object | string> {
  item: T;
  choiceSelected: boolean;
  choiceHighlighted?: boolean;
  itemText?: (item: T) => string;
  onSelected: (item: T) => void;
  choiceDisabled?: boolean;
}
