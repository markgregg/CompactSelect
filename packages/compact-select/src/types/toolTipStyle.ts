import CSS from "csstype";

export interface ToolTipStyle {
  toolTipStyle?: CSS.Properties;
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
  toolTipPosition?: "above" | "below" | "left" | "right";
}