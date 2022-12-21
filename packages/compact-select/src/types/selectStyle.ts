import CSS from "csstype";
import { IconType } from "react-icons/lib";

export interface SelectStyle {
  selectStyle?: CSS.Properties;
  selectDisabledStyle?: CSS.Properties;
  inputStyle?: CSS.Properties;
  inputDisabledStyle?: CSS.Properties;
  clearSelectionStyle?: CSS.Properties;
  clearSelectionDisabledStyle?: CSS.Properties;
  clearSelectionHoverStyle?: CSS.Properties;
  titleStyle?: CSS.Properties;
  titleDisabledStyle?: CSS.Properties;
  dropdownIconStyle?: CSS.Properties;
  dropdownIcondisabledStyle?: CSS.Properties;
  hideDropdownIcon?: boolean;
  dropdownIcon?: IconType;
  dropdownIconColor?: CSS.Property.Color;
  dropdownIconDisabledColor?: CSS.Property.Color;
  hideTitle?: boolean;
  listStyle?: CSS.Properties;
  height?: CSS.Property.Height;
  width?: CSS.Property.Width;
  minWidth?: CSS.Property.MinWidth;
  maxWidth?: CSS.Property.MaxWidth;
  fontSize?: CSS.Property.FontSize;
  fontFamily?: CSS.Property.FontFamily;
  fontWeight?: CSS.Property.FontWeight;
  fontStyle?: CSS.Property.FontStyle;
  color?: CSS.Property.Color;
  backgroundColor?: CSS.Property.BackgroundColor;
  backgroundImage?: CSS.Property.BackgroundImage;
  disabledColor?: CSS.Property.Color;
  disableBackgroundColor?: CSS.Property.BackgroundColor;
  disableBackgroundImage?: CSS.Property.BackgroundImage;
  border?: CSS.Property.Border;
  borderColor?: CSS.Property.Color;
  borderRadius?: CSS.Property.BorderRadius;
  clearSelectionIcon?: IconType;
  clearSelectionColor?: CSS.Property.Color;
  clearSelectionDisabledColor?: CSS.Property.Color;
  clearSelectionHoverColor?: CSS.Property.Color;
  clearSelectionSize?: CSS.Property.FontSize;
  titleColor?: CSS.Property.Color;
  disabledTitleColor?: CSS.Property.Color;
  titleFontFamily?: CSS.Property.FontFamily;
  titleFontSize?: CSS.Property.FontSize;
  titleFontWeight?: CSS.Property.FontWeight;
  titleFontStyle?: CSS.Property.FontStyle;
  choiceListMaxHeight?: CSS.Property.MaxHeight;
  choiceListBackgroundColor?: CSS.Property.BackgroundColor;
  choiceListBackgroundImage?: CSS.Property.BackgroundImage;
  choiceListBorderRadius?: CSS.Property.BorderRadius;
  choiceListBorder?: CSS.Property.Border;
  choiceListBorderColor?: CSS.Property.Color;
}
