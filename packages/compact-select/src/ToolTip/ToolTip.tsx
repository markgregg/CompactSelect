import { FC } from 'react';
import CSS from 'csstype';
import { ToolTipProps, ToolTipStyle } from '../types';
import scssClasses from './styles.module.scss';

const ToolTip: FC<ToolTipProps & ToolTipStyle> = ({
  tip,
  show,
  toolTipClassName,
  toolTipStyle,
  toolTipBackgroundColor,
  toolTipBackgroundImage,
  toolTipFontFamily,
  toolTipFontWeight,
  toolTipFontSize,
  toolTipColor,
  toolTipTextAlign,
  toolTipBorderColor,
  toolTipBorder,
  toolTopBorderRadius,
  toolTipFontStyle,
  toolTipPosition,
  children,
}) => {
  const position = (): CSS.Properties => {
    switch (toolTipPosition) {
      case 'above':
        return {
          top: '-100%',
          left: '0px',
        };
      case 'left':
        return {
          top: '-25%',
          left: '100%',
          width: '80px',
        };
      case 'right':
        return {
          top: '-25%',
          left: '-80px',
          width: '80px',
        };
      default:
        return {
          top: '100%',
          left: '0%',
        };
    }
  };

  const toolTip = (): CSS.Properties => {
    return toolTipStyle
      ? toolTipStyle
      : {
          color: toolTipColor ?? 'black',
          font: toolTipFontFamily,
          fontWeight: toolTipFontWeight,
          fontSize: toolTipFontSize ?? 'small',
          fontStyle: toolTipFontStyle,
          textAlign: toolTipTextAlign ?? 'center',
          borderColor: toolTipBorderColor,
          borderRadius: toolTopBorderRadius ?? '5px',
          border: toolTipBorder,
          backgroundColor: toolTipBackgroundColor,
          backgroundImage: toolTipBackgroundImage,
          ...position(),
        };
  };

  return (
    <div
      className={
        scssClasses.toolTip + (toolTipClassName ? ` ${toolTipClassName}` : '')
      }
    >
      {children}
      {show && tip !== '' && (
        <span className={scssClasses.toolTipText} style={toolTip()}>
          {tip}
        </span>
      )}
    </div>
  );
};

export default ToolTip;
