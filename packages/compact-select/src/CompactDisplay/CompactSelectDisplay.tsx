import CSS from "csstype";
import { DisplayProps, DisplayStyle } from "../types";
import "./CompactSelectDisplay.css";

const CompactDisplay = <T extends object | string>(
  props: DisplayProps<T> & DisplayStyle
) => {
  const textDisplayClassName = (): string =>
    props.disabled && props.displayDisabledClassName
      ? ` ${props.displayDisabledClassName}`
      : "";

  const displayTitle =
    props.selected.length === 0 &&
    (!props.choicesShown ||
      !props.selectType ||
      props.selectType !== "standard");

  const textDisplayStyle = (): CSS.Properties =>
    props.disabled && props.displayDisabledStyle
      ? props.displayDisabledStyle
      : props.displayStyle ?? {
          color: props.disabled
            ? props.disabledTitleColor ?? props.disabledColor ?? "darkgray"
            : displayTitle
            ? props.titleColor ?? props.color ?? "black"
            : props.color ?? "black",
          fontSize: displayTitle
            ? props.titleFontSize ?? props.fontSize
            : props.fontSize,
          fontFamily: displayTitle
            ? props.titleFontFamily ?? props.fontFamily ?? "unset"
            : props.fontFamily ?? "unset",
          fontWeight: displayTitle
            ? props.titleFontWeight ?? 100
            : props.fontWeight ?? "bold",
          fontStyle: displayTitle ? props.titleFontStyle : props.fontStyle,
        };

  return (
    <p
      className={"csCompactTextDisplay" + textDisplayClassName()}
      style={textDisplayStyle()}
    >
      {displayTitle ? props.title : props.text}
    </p>
  );
};

export default CompactDisplay;
