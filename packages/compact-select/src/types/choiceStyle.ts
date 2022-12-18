import CSS from "csstype";
import { IconType } from "react-icons/lib";

export interface ChoiceStyle {
  choiceSelectedIcon?: IconType;
  choiceHeight?: CSS.Property.Height;
  choiceFontWeight?: CSS.Property.FontWeight;
  choiceFontFamily?: CSS.Property.FontFamily;
  choiceFontSize?: CSS.Property.FontSize;
  choiceColor?: CSS.Property.Color;
  choiceFontStyle?: CSS.Property.FontStyle;
  choiceBackgroundColor?: CSS.Property.BackgroundColor;
  choiceBackgroundImage?: CSS.Property.BackgroundImage;
  choiceSelectedBorder?: CSS.Property.Border;
  choiceDisabledColor?: CSS.Property.Color;
  choicedisabledBackgroundColor?: CSS.Property.BackgroundColor;
  choiceDisabledBackgroundImage?: CSS.Property.BackgroundImage;
  choiceSelectedWidth?: CSS.Property.Width;
  choiceSelectIndiacatorType?: "icon" | "color" | "border";
  choiceSelectedIconSize?: CSS.Property.FontSize;
  choiceSelectedColor?: CSS.Property.Color;
  choiceSelectedBackgroundColor?: CSS.Property.BackgroundColor;
  choiceSelectedBackgroundImage?: CSS.Property.BackgroundImage;
  choiceHoverBackgroundColor?: CSS.Property.BackgroundColor;
  choiceHoverBackgroundImage?: CSS.Property.BackgroundImage;
}