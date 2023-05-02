import CSS from 'csstype';
import { IconType } from 'react-icons/lib';
import { ChoiceProps } from './choiceProps';
import { ChoiceStyle } from './choiceStyle';
import { DisplayProps } from './displayProps';
import { DisplayStyle } from './displayStyle';
import { ToolTipProps } from './toolTipProps';
import { ToolTipStyle } from './toolTipStyle';

export interface SelectStyle {
  toolTipComponent?: (props: ToolTipProps & ToolTipStyle) => JSX.Element;
  choiceComponent?: <T extends object | string>(
    props: ChoiceProps<T> & ChoiceStyle
  ) => JSX.Element;
  displayComponent?: <T extends object | string>(
    props: DisplayProps<T> & DisplayStyle
  ) => JSX.Element;
  style?: CSS.Properties;
  selectStyle?: CSS.Properties;
  selectDisabledStyle?: CSS.Properties;
  className?: string;
  disabledClassName?: string;
  inputStyle?: CSS.Properties;
  inputDisabledStyle?: CSS.Properties;
  inputClassName?: CSS.Properties;
  inputDisabledClassName?: string;
  clearSelectionStyle?: CSS.Properties;
  clearSelectionDisabledStyle?: CSS.Properties;
  clearSelectionClassName?: string;
  clearSelectionDisabledClassName?: string;
  titleStyle?: CSS.Properties;
  titleDisabledStyle?: CSS.Properties;
  titleClassName?: string;
  titleDisabledClassName?: string;
  choiceListStyle?: CSS.Properties;
  choiceListClassName?: string;
  dropdownIconStyle?: CSS.Properties;
  dropdownIconDisabledStyle?: CSS.Properties;
  dropIconClassName?: string;
  dropIconDisabledClassName?: string;
  hideDropdownIcon?: boolean;
  dropdownIcon?: IconType;
  clearSelectionIcon?: IconType;
  hideTitle?: boolean;
  height?: CSS.Property.Height;
  minHeight?: CSS.Property.MinHeight;
  maxHeight?: CSS.Property.MaxHeight;
  width?: CSS.Property.Width;
  minWidth?: CSS.Property.MinWidth;
  maxWidth?: CSS.Property.MaxWidth;
}
