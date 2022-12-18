import CSS from "csstype";

export interface ToolTipStyle {
  toolTipBackgroundColor?: CSS.Property.BackgroundColor;
  toolTipBackgroundImage?: CSS.Property.BackgroundImage;
  toolTipFontFamily?: CSS.Property.FontFamily;
  toolTipFontWeight?: CSS.Property.FontWeight;
  toolTipFontSize?: CSS.Property.FontSize;
  toolTipFontStyle?: CSS.Property.FontStyle;
  toolTipColor?: CSS.Property.Color;
  toolTipTextAlign?: CSS.Property.TextAlign;
  toolTipBorderColor?: CSS.Property.Color;
  toolTipBorder?: CSS.Property.Border;
  toolTopBorderRadius?: CSS.Property.BorderRadius;
  toolTipBorderStyle?: CSS.Property.BorderStyle;
  toolTipPosition?: "above" | "below" | "left" | "right";
}