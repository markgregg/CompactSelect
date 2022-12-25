import CSS from 'csstype';

export interface DisplayStyle {
  displayStyle?: CSS.Properties;
  displayDisabledStyle?: CSS.Properties;
  displayClassName?: CSS.Properties;
  displayDisabledClassName?: string;
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
  titleColor?: CSS.Property.Color;
  disabledTitleColor?: CSS.Property.Color;
  titleFontFamily?: CSS.Property.FontFamily;
  titleFontSize?: CSS.Property.FontSize;
  titleFontWeight?: CSS.Property.FontWeight;
  titleFontStyle?: CSS.Property.FontStyle;
}
