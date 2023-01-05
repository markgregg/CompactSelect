import CSS from 'csstype';
import { IconType } from 'react-icons/lib';

export interface ChoiceStyle {
  choiceStyle?: CSS.Properties;
  choiceSelectedStyle?: CSS.Properties;
  choiceHoverStyle?: CSS.Properties;
  choiceDisabledStyle?: CSS.Properties;
  choiceClassName?: string;
  choiceSelectedClassName?: string;
  choiceDisabledClassName?: string;
  choiceHoverClassName?: string;
  choiceSelectedIconStyle?: CSS.Properties;
  choiceSelectedIconClassName?: string;
  choiceSelectedIcon?: IconType;
  hideSelectedIcon?: boolean;
}
