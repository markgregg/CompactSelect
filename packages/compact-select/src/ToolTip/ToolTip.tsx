import { FC } from "react";
import CSS from "csstype";
import { ToolTipProps, ToolTipStyle } from "../types";
import "./Tooltip.css"

const ToolTip: FC<ToolTipProps & ToolTipStyle> = ({
  tip,
  show,
  toolTipClassName,
  toolTipStyle,
  toolTipPosition,
  children,
}) => {
  const position = (): CSS.Properties => {
    switch (toolTipPosition) {
      case "above":
        return {
          top: "-100%",
          left: "0px",
        };
      case "left":
        return {
          top: "-25%",
          left: "100%",
          width: "80px",
        };
      case "right":
        return {
          top: "-25%",
          left: "-80px",
          width: "80px",
        };
      default:
        return {
          top: "100%",
          left: "0%",
        };
    }
  };


  return (
    <div className="toolTip">
      {children}
      {show && tip !== "" && (
        <span 
          className={"toolTipText"+ (toolTipClassName ? ` ${toolTipClassName}` : "")} 
          style={{
            ...toolTipStyle,
            ...position()
          }}
        >
          {tip}
        </span>
      )}
    </div>
  );
};


export default ToolTip;
