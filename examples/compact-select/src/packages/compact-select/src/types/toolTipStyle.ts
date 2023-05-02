import CSS from 'csstype';

export interface ToolTipStyle {
  toolTipClassName?: string;
  toolTipStyle?: CSS.Properties;
  toolTipPosition?: 'above' | 'below' | 'left' | 'right';
}
