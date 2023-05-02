import CSS from "csstype";
import { DisplayProps, DisplayStyle } from "../types";
import "./CompactSelectDisplay.css";

const CompactDisplay = <T extends object | string>(
  props: DisplayProps<T> & DisplayStyle
) => {

  const displayTitle =
    props.selected.length === 0 &&
    (!props.choicesShown ||
      !props.selectType ||
      props.selectType === "switch");

  const textDisplayClassNameForState = (): string =>
    props.disabled
      ? ( props.displayDisabledClassName ? ` ${props.displayDisabledClassName}` : " csCompactSelectTextDisplayDisabled" )
      :  ( props.displayClassName ? ` ${props.displayClassName}` : "" )

  const textDisplayClassNameForType = (): string =>
    displayTitle
      ? " csCompactSelectTextDisplayTitle"
      : " csCompactSelectTextDisplaySelectedItem";

  const textDisplayStyle = (): CSS.Properties =>
    props.disabled && props.displayDisabledStyle
      ? props.displayDisabledStyle
      : props.displayStyle ?? {}

  return (
    <p
      className={"csCompactSelectTextDisplay" + textDisplayClassNameForState() + textDisplayClassNameForType()}
      style={textDisplayStyle()}
    >
      {displayTitle ? props.title : props.text}
    </p>
  );
};

export default CompactDisplay;
