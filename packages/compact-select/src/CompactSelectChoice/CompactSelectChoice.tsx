import CSS from "csstype";
import { MouseEvent } from "react";
import { GiCheckMark } from "react-icons/gi";
import { Choice, ChoiceStyle } from "../types";
import { ChoiceProps } from "../types/";
import { errorMessage } from "../utils/domUtils";
import scssClasses from "./styles.module.scss";

const CompactSelectChoice = <T extends object | string>(
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

  const background = (): CSS.Properties =>
    props.choiceDisabled
      ? {
          backgroundColor: props.choiceDisabledBackgroundColor ?? "Gainsboro",
          backgroundImage: props.choiceDisabledBackgroundImage
       }
      : props.choiceHighlighted
        ? {
          backgroundColor: props.choiceHoverBackgroundColor ?? "lightgray",
          backgroundImage: props.choiceHoverBackgroundImage
        }
        : props.choiceSelected && props.choiceSelectIndiacatorType === "color"
          ? {
              backgroundColor: props.choiceSelectedBackgroundColor ?? "green",
              backgroundImage: props.choiceSelectedBackgroundImage
            }
          : {
              backgroundColor: props.choiceBackgroundColor,
              backgroundImage: props.choiceBackgroundImage
          };

  const border = (): CSS.Properties => 
    props.choiceSelectIndiacatorType === "border" && props.choiceSelected
      ? {
          border: props.choiceSelectedBorder ?? "2px solid lightgreen"
      } 
      : {};
      
  const choiceStyle = (): CSS.Properties => {
    return props.choiceDisabled && props.choiceDisabledStyle 
      ? props.choiceDisabledStyle
      : props.choiceSelected && props.choiceSelectedStyle
      ? props.choiceSelectedStyle
      : props.choiceHighlighted && props.choiceHoverStyle
      ? props.choiceHoverStyle
      : props.choiceStyle ??
      {
        height: "35px",
        color: props.choiceDisabled
          ? props.choiceDisabledColor ?? "darkgray"
          : props.choiceColor ?? "black",
        fontWeight: props.choiceFontWeight,
        fontFamily: props.choiceFontFamily,
        fontSize: props.choiceFontSize,
        fontStyle: props.choiceFontStyle,
        ...border(),
        ...background(),
      };
  };

  const selectSelected = (): CSS.Properties => {
    return props.choiceSelectedIconStyle ?? {
      fontSize: props.choiceSelectedIconSize ?? "large",
      color: props.choiceSelectedColor ?? "green",
    };
  };

  const choiceClassName = (): string => 
    props.choiceDisabled && props.choiceDisabledClassName
      ? ` ${props.choiceDisabledClassName}`
      : props.choiceSelected && props.choiceSelectedClassName
      ? ` ${props.choiceSelectedClassName}`
      : props.choiceHighlighted && props.choiceHoverClassName
      ? ` ${props.choiceHoverClassName}`
      : props.choiceClassName
      ? ` ${props.choiceClassName}`
      : "";

  return (
    <div
      className={scssClasses.csChoice + choiceClassName()}
      style={choiceStyle()}
      onClick={selectItem}
    >
      <div className={scssClasses.csSelectedSelectedDiv}>
        {props.choiceSelected && (!props.choiceSelectIndiacatorType || props.choiceSelectIndiacatorType === "icon") && (
          <div>
            {props.choiceSelectedIcon ? (
              <props.choiceSelectedIcon
                className={scssClasses.csSelectedSelected + (props.choiceSelectedIconClassName ? ` ${props.choiceSelectedIconClassName}` : "")}
                style={selectSelected()}
              />
            ) : (
              <GiCheckMark
                className={scssClasses.csSelectedSelected + (props.choiceSelectedIconClassName ? ` ${props.choiceSelectedIconClassName}` : "")}
                style={selectSelected()}
              />
            )}
          </div>
        )}
      </div>
      <p className={scssClasses.csChoiceText}>{getItemText(props.item)}</p>
    </div>
  );
}

export default CompactSelectChoice;
