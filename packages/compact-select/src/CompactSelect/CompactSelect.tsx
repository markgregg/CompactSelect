import {
  useState,
  useEffect,
} from "react";
import CSS from "csstype";
import { MdClear } from "react-icons/md";
import { RiArrowDropDownFill } from "react-icons/ri";
import CompactChoice from "../CompactChoice";
import ToolTip from "../ToolTip";
import {
  ChoiceStyle,
  SelectProps,
  ToolTipStyle,
  SelectStyle,
  DisplayStyle,
  DisplayProps,
  ChoiceProps,
} from "../types";
import"./CompactSelect.css";
import CompactDisplay from "../CompactDisplay";
import { CompactSelectModel, createCompactSelectModel } from "./CompactSelectModel";

export interface CompactSelectProps<T extends object | string>
  extends SelectProps<T>,
    SelectStyle,
    ChoiceStyle,
    DisplayStyle,
    ToolTipStyle {}

const CompactSelect = <T extends object | string>(
  props: CompactSelectProps<T>
) => {
  const [,setRefresh] = useState<number>(0);
  const [model,] = useState<CompactSelectModel<T>>(createCompactSelectModel({refresh: setRefresh,...(props as SelectProps<T>)}))

  useEffect(() => {
    model.updateSelection(props.selected);
  }, [props.selected]);

  useEffect(() => {
    //detected when to close item list
    document.addEventListener("click", model.clickedAway, true);
    return () => {
      document.removeEventListener("click", model.clickedAway, true);
    };
  }, []);

  const compactSelectStyle = (): CSS.Properties => {
    return {
      height: props.height,
      minHeight: props.minHeight,
      maxHeight: props.maxHeight,
      width: props.width,
      minWidth: props.minWidth,
      maxWidth: props.maxWidth,
      ...props.style
    };
  }

  const clearSelectionClassName = (): string =>
    props.disabled
      ? (props.clearSelectionDisabledClassName ? props.clearSelectionDisabledClassName : "csCompactClearSelectionDisabled")
      : (props.clearSelectionClassName ? props.clearSelectionClassName : "csCompactClearSelectionStandard");

  const clearSelectedStyle = (): CSS.Properties =>
    props.disabled && props.clearSelectionDisabledStyle
      ? props.clearSelectionDisabledStyle
      : props.clearSelectionStyle ?? {};

  const displayTextProps = (): DisplayProps<T> & DisplayStyle => {
    return {
      title: props.title,
      text: model.displayText,
      choicesShown: model.showChoices,
      selected: model.selected,
      selectType: props.selectType,
      disabled: props.disabled,
      ...(props as DisplayStyle),
    };
  };

  const dropIconClassName = (): string =>
    props.disabled
      ? (props.dropIconDisabledClassName ? props.dropIconDisabledClassName : "csCompactDropDownIconDisabled")
      : (props.dropIconClassName ? props.dropIconClassName : "");

  const dropdownIconStyle = (): CSS.Properties =>
    props.disabled && props.dropdownIconDisabledStyle
      ? props.dropdownIconDisabledStyle
      : props.dropdownIconStyle ?? {};


  const compactSelectClass = (): string =>
    props.disabled
      ? ( props.disabledClassName ? ` ${props.disabledClassName}` : " compactSelectDisabled" )
      : ( props.className ? ` ${props.className}` : " compactSelectStandard" );

  const inputStyle = (): CSS.Properties =>
      props.disabled && props.inputDisabledStyle
        ? props.inputDisabledStyle
        : props.inputStyle ?? {};

  const inputClassName = (): string =>
    props.disabled
      ? (props.inputDisabledClassName ? ` ${props.inputDisabledClassName}` : " csCompactInputDisabled" )
      : ( props.inputClassName ? ` ${props.inputClassName}`: "" );

  const titleClassName = (): string =>
    props.disabled
      ? (props.titleDisabledClassName ? ` ${props.titleDisabledClassName}` : " csCompactSelectTitleDisabled" )
      : ( props.titleClassName ? ` ${props.titleClassName}` : "" );

  const titleDisplayStyle = (): CSS.Properties =>
    props.disabled && props.titleDisabledStyle
      ? props.titleDisabledStyle
      : props.titleStyle ?? {};

  const choiceProps = (
    highlighted: boolean,
    selected: boolean,
    item: T
  ): ChoiceProps<T> & ChoiceStyle => {
    return {
      itemText: props.itemText,
      item,
      choiceSelected: selected,
      onSelected: selected ? model.deselectItem : model.selectItem,
      choiceHighlighted: highlighted,
      choiceDisabled: model.isDisabled(item),
      ...(props as ChoiceStyle),
    };
  };

  const constructChoice = (
    highlighted: boolean,
    selected: boolean,
    item: T
  ): JSX.Element =>
    props.choiceComponent ? (
      <div
        key={
          (highlighted ? "high-" : "") +
          (selected ? "selected-" : "") +
          model.getItemValue(item)
        }
      >
        {props.choiceComponent({ ...choiceProps(highlighted, selected, item) })}
      </div>
    ) : (
      <CompactChoice
        key={
          (highlighted ? "high-" : "") +
          (selected ? "selected-" : "") +
          model.getItemValue(item)
        }
        {...choiceProps(highlighted, selected, item)}
      />
    );

  const toolTip = (child: JSX.Element): JSX.Element =>
    props.toolTipComponent ? (
      props.toolTipComponent({
        children: child,
        tip: model.caption,
        show: model.showToolTip,
        ...props as ToolTipStyle,
      })
    ) : (
      <ToolTip
        children={child}
        tip={model.caption}
        show={model.showToolTip}
        {...props as ToolTipStyle}
      />
    );

  return (
    <div
      className={"csCompactSelect" + compactSelectClass()}
      style={compactSelectStyle()}
      onMouseEnter={model.checkToolTip}
      onMouseLeave={model.hideToolTip}
      onPaste={model.pasteText}
      onClick={model.textInputClicked}
    >
      {toolTip(
        <div className="csContentSelectWrapper">
          {(!props.maximumSelections || props.maximumSelections < 1) &&
            model.selected.length > 0 &&
            props.selectType !== "switch" && (
              <div
                className="csCompactClearSelection"
                onClick={model.clearSelection}
              >
                {props.clearSelectionIcon ? (
                  <props.clearSelectionIcon
                    className={clearSelectionClassName()}
                    style={clearSelectedStyle()}
                  />
                ) : (
                  <MdClear
                    className={clearSelectionClassName()}
                    style={clearSelectedStyle()}
                  />
                )}
              </div>
            )}
          <div className="csCompactMainDisplay">
            <div className="csCompactTextWrapper">
              {model.showChoices &&
              (!props.selectType || props.selectType === "standard") ? (
                <input
                  ref={model.inputRef}
                  id={"csInput" + model.selectId}
                  className={"csCompactInput" + inputClassName()}
                  style={inputStyle()}
                  value={
                    model.showChoices
                      ? model.inputText
                      : model.displayText === ""
                      ? props.title
                      : model.displayText
                  }
                  disabled={props.disabled}
                  spellCheck="false"
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  onChange={model.textChanged}
                  onKeyDownCapture={model.inputKeyPressed}
                />
              ) : props.displayComponent ? (
                props.displayComponent(displayTextProps())
              ) : (
                <CompactDisplay {...displayTextProps()} />
              )}
            </div>
            {!props.hideDropdownIcon &&
              props.selectType !== "switch" && (
                <div>
                  {props.dropdownIcon ? (
                    <props.dropdownIcon
                      className={dropIconClassName()}
                      style={dropdownIconStyle()}
                    />
                  ) : (
                    <RiArrowDropDownFill
                      className={dropIconClassName()}
                      style={dropdownIconStyle()}
                    />
                  )}
                </div>
              )}
          </div>
          {(model.showChoices || model.displayText !== "") && !props.hideTitle && (
            <p
              className={"csCompactSelectTitle" + titleClassName()}
              style={titleDisplayStyle()}
            >
              {props.title}
            </p>
          )}
          {!props.disabled && model.showChoices && (
            <div
              id={"csList" + model.selectId}
              className={ "csCompactChoiceContainer" + ` ${props.choiceListClassName}`}
              style={props.choiceListStyle}
            >
              <ul className="csCompactChoiceList">
                {model.visibleChoices.length > 0 &&
                  model.visibleChoices.map((item, index) => (
                    <li
                      id={`item_${index}`}
                      key={`item_${index}`}
                      onMouseOverCapture={() => model.adjustHighlightedIndexOnly(index)}
                    >
                      {constructChoice(
                        model.highlightedIndex === index,
                        model.selected.indexOf(item) !== -1,
                        item
                      )}
                    </li>
                  ))}
                {model.visibleChoices.length === 0 &&
                  !props.choices &&
                  !model.lookedUpChoices && (
                    <p>
                      {props.loadingText ?? "Loading..."}
                    </p>
                  )}
                {props.choices?.length === 0 && model.lookedUpChoices && (
                  <p>
                    {props.noItemText ?? "No items."}
                  </p>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
    
  );
};

export default CompactSelect;
