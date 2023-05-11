import CSS from "csstype";
import { MouseEvent } from "react";
import { GiCheckMark } from "react-icons/gi";
import { Choice, ChoiceStyle } from "../types";
import { ChoiceProps } from "../types";
import { errorMessage } from "../utils/domUtils";
import "./CompactChoice.css"

const CompactChoice = <T extends Choice | object | string>(
  props: ChoiceProps<T> & ChoiceStyle
) => {
  const selectItem = (event: MouseEvent<HTMLDivElement>) => {
    if (!props.choiceDisabled) {
      props.onSelected(props.item);
      event.stopPropagation();
    }
  };

  const getItemText = (item: T): string => {
    try {
      return (
        (item as Choice).text ??
        (props.itemText ? props.itemText(item) : (item as string))
      );
    } catch (error) {
      console.log(
        `Object type either does not implement Choice, the property getters (itemText | itemValue) or is not a string, error: ${errorMessage}`
      );
    }
    return "";
  };

  const choiceStyle = (): CSS.Properties =>
  props.choiceDisabled && props.choiceDisabledStyle
    ? props.choiceDisabledStyle
    : props.choiceHighlighted && props.choiceHoverStyle
    ? props.choiceHoverStyle
    : props.choiceSelected && props.choiceSelectedStyle
    ? props.choiceSelectedStyle
    : props.choiceStyle ?? {};

  const choiceClassName = (): string =>
    props.choiceDisabled
      ? ( props.choiceDisabledClassName ? ` ${props.choiceDisabledClassName}` : " csCompactSelectChoiceDisabled" )
      : props.choiceHighlighted
      ? ( props.choiceHoverClassName ? ` ${props.choiceHoverClassName}` : " csCompactSelectChoiceHighlighted" )
      : props.choiceSelected 
      ? ( props.choiceSelectedClassName ? ` ${props.choiceSelectedClassName}` : " csCompactSelectChoiceSelected" )
      : props.choiceClassName
      ? ( props.choiceClassName ? ` ${props.choiceClassName}` : " csCompactSelectChoice" )
      : "";

  return (
    <div
      className={"csCompactChoice" + choiceClassName()}
      style={choiceStyle()}
      onClick={selectItem}
    >
      <div className="csCompactSelectedSelectedDiv">
        {props.choiceSelected && ! props.hideSelectedIcon && (
            <div>
              {props.choiceSelectedIcon ? (
                <props.choiceSelectedIcon
                className={props.choiceSelectedIconClassName ?? "csCompactChoiceSelectedIcon"}
                  style={props.choiceSelectedIconStyle}
                />
              ) : (
                <GiCheckMark
                  className={props.choiceSelectedIconClassName  ?? "csCompactChoiceSelectedIcon"}
                  style={props.choiceSelectedIconStyle}
                />
              )}
            </div>
          )}
      </div>
      <p className="csCompactChoiceText">{getItemText(props.item)}</p>
    </div>
  );
};

export default CompactChoice;
