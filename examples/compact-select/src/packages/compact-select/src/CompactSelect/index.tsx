import {
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";
import CSS from "csstype";
import { MdClear, MdDoneAll } from "react-icons/md";
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
  Choice,
} from "../types";
import"./CompactSelect.css";
import CompactDisplay from "../CompactDisplay";
import { CompactSelectModel, createCompactSelectModel } from "./CompactSelectModel";
import { Group } from "../types/selectProps";


export interface CompactSelectProps<T extends Choice | object | string>
  extends SelectProps<T>,
    SelectStyle,
    ChoiceStyle,
    DisplayStyle,
    ToolTipStyle {}


const CompactSelect = <T extends Choice | object | string>(
  props: CompactSelectProps<T>
) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [,refresh] = useState<number>(0);
  const refreshDisplay = () => {
    refresh(performance.now());
  }
  const model = useMemo<CompactSelectModel<T>>( () => createCompactSelectModel(props), [] );
  model.updateProps(props);
  model.refresh = refreshDisplay;

  useEffect(() => {
    //detected when to close item list
    document.addEventListener("click", e => model.clickedAway(e), true);
    return () => {
      document.removeEventListener("click", e => model.clickedAway(e), true);
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
      onSelected: selected 
        ? item => model.deselectItem(item) 
        : item => model.selectItem(item),
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

  const showItems = (items: (T | Group<T>)[], index: number) => {
    return items.map(item => {
      if( typeof item === 'object' && 'choices' in item ) {
        const tmpIdx = index;
        index += item.choices.length;
        return <div 
            key={item.label}
            className="csCompactChoiceListCategory"
          >
          <div>{item.label}</div>
          {
            <ul className="csCompactChoiceList">
              {
                item.choices.length > 0 &&
                  showItems(item.choices, tmpIdx)
              }   
            </ul>
          }
        </div>
      } else {
        const itemIndex = index++;
        return <li
          id={`item_${itemIndex}`}
          key={`item_${itemIndex}`}
          onMouseOverCapture={() => model.adjustHighlightedIndexOnly(itemIndex)}
        >
          {
            constructChoice(
              model.highlightedIndex === itemIndex,
              model.selected.indexOf(item) !== -1,
              item
            )
          }
        </li>
      }
    })
  }

  return (
    <div
      id={"csInput" + model.selectId}
      className={"csCompactSelect" + compactSelectClass()}
      style={compactSelectStyle()}
      onMouseEnter={() => model.checkToolTip()}
      onMouseLeave={() => model.hideToolTip()}
      onPaste={e => model.pasteText(e)}
      onClick={() => model.textInputClicked(inputRef)}
    >
      {toolTip(
        <div className="csContentSelectWrapper">
          {(!props.maximumSelections || props.maximumSelections < 1) &&
            model.selected.length > 0 &&
            props.selectType !== "switch" && (
              <div
                className="csCompactClearSelection"
                onClick={e => model.clearSelection(e)}
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
                  ref={inputRef}
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
                  onChange={e => model.textChanged(e)}
                  onKeyDownCapture={e => model.inputKeyPressed(e)}
                />
              ) : props.displayComponent ? (
                props.displayComponent(displayTextProps())
              ) : (
                <CompactDisplay {...displayTextProps()} />
              )}
            </div>
            {
              props.allowSelectAll && model.showChoices &&
              (!props.selectType || props.selectType === "standard") &&
              model.inputText.length > 0 && 
                <div
                  className="csCompactSelectAll"
                  onClick={() => model.selectAll()}
                >
                  <MdDoneAll/>
                </div>
            } 
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
                {
                  model.visibleChoices.length > 0 &&
                    showItems(model.visibleChoices, 0)
                }
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
