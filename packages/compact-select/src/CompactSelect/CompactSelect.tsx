import {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ClipboardEvent,
} from "react";
import CSS from "csstype";
import { Cache, createCache } from "../cache/cache";
import { errorMessage } from "../utils/domUtils";
import { generateGuid } from "../utils/guidGenerator";
import { TiDeleteOutline } from "react-icons/ti";
import { RiArrowDropDownFill } from "react-icons/ri";
import CompactSelectChoice from "../CompactSelectChoice";
import ToolTip from "../ToolTip";
import { scrollIntoView } from "../utils/domUtils";
import {
  Choice,
  ChoiceStyle,
  SelectProps,
  ToolTipStyle,
  SelectStyle,
  DisplayStyle,
  DisplayProps,
  ChoiceProps,
} from "../types";
import scssClasses from "./styles.module.scss";
import CompactSelectDisplay from "../CompactSelectDisplay";

interface State<T extends object | string> {
  token: string;
  inputText: string;
  showChoices: boolean;
  lookedUpChoices?: T[];
  selected: T[];
  visibleChoices: T[];
  cache?: Cache<T>;
  highlightedIndex: number;
  selectId: string;
}
const defaultToolTipLimit = 20;

export interface CompactSelectProps<T extends object | string> extends SelectProps<T>, SelectStyle, ChoiceStyle, ToolTipStyle {}

const CompactSelect = <T extends object | string>(
  props: CompactSelectProps<T>
) => {
  const inputRefence = useRef<HTMLInputElement>(null);
  //returns text of an item
  const getItemText = (item: T): string => {
    try {
      return (
        (item as Choice).text ??
        (props.itemText ? props.itemText(item) : (item as string))
      );
    } catch (error) {
      console.log(
        `Object type either does not implement Choice, the property getters (itemText | itemValue) or is not a string, error: ${errorMessage(error)}`
      );
    }
    return "";
  };

  //returns value of an item
  const getItemValue = (item: T): any => {
    try {
      return (
        (item as Choice).value ??
        (props.itemValue ? props.itemValue(item) : item)
      );
    } catch (error) {
      console.log(
        `Object type either does not implement Choice, the property getters (itemText | itemValue) or is not a string, error: ${errorMessage(error)}`
      );
    }
    return "";
  };

  //returns value of an item
  const getItemValueString = (item: T): string => {
    try {
      const value = (
        (item as Choice).value  ??
        (props.itemValue ? props.itemValue(item) : item)
      );
      return typeof value === 'string' ? value : value.toString();
    } catch (error) {
      console.log(
        `Object type either does not implement Choice, the property getters (itemText | itemValue) or is not a string, error: ${errorMessage(error)}`
      );
    }
    return "";
  };

  //returns disabled property of an item
  const isDisabled = (item: T): boolean => {
    try {
      return (
        (item as Choice).disabled ??
        (props.itemDisabled ? props.itemDisabled(item) : false)
      );
    } catch (error) {
      console.log(
        `Object type either does not implement Choice, the property getters (itemText | itemValue) or is not a string, error: ${errorMessage(error)}`
      );
    }
    return false;
  };

  const getSelection = (): T[] => {
    try {
      if (
        props.selectType === "switch" ||
        (props.maximumSelections === 1 && props.minimumSelections === 1)
      ) {
        if( props.selected && Array.isArray(props.selected) && props.selected.length > 0 ) {
          return [props.selected[0]];
        }
        if (props.selected && !Array.isArray(props.selected) ) {
          return [props.selected];
        }
        if (props.choices && props.choices.length > 0) {
          return [props.choices[0]];
        }
        return [];
      }
      return props.selected && Array.isArray(props.selected) 
        ? props.selected 
        :  props.selected && !Array.isArray(props.selected) 
          ? [props.selected as T]
          : [];
    } catch (error) {
      console.log(
        `Failed to fetch selection, reason: ${errorMessage(error)}`
      );
    }
    return [];
  };

  const getDisplayText = (selection: T[]): string => {
    try {
      return selection.length > 1 
        ? `${selection.length} items`
        : selection.length === 1
          ? getItemText(selection[0])
          : "";
    } catch (error) {
      console.log(
        `Failed to fetch display text, reason: ${errorMessage(error)}`
      );
      return "";
    }
  }

  const toolTipLimit = (): number => props.toolTipValueLimit ?? defaultToolTipLimit;

  const getCaption = (selection: T[]): string => {
    try {
      return selection.length > 1 
        ? selection.slice(0,toolTipLimit()).map((item) => getItemText(item)).join(", ") 
          + (selection.length > toolTipLimit() 
          ? ` + ${selection.length - toolTipLimit()} more items` : "")
        : "";
    } catch (error) {
      console.log(
        `Failed to fetch caption text, reason: ${errorMessage(error)}`
      );
      return "";
    }
    
  }
  
  //state not required for visual updates
  const [state] = useState<State<T>>({
    token: "",
    selected: getSelection(),
    inputText: "",
    showChoices: false,
    visibleChoices: [],
    cache: props.cacheLookUp
      ? createCache<T>(
          props.title,
          props.cacheTimeToLive,
          props.cacheExpiryCheck
        )
      : undefined,
    highlightedIndex: -1,
    selectId: generateGuid()
  });

  //state use to trigger visual updates
  const [inputText, setInputText] = useState<string>("");
  const [showChoices, setShowChoices] = useState<boolean>(false);
  const [visibleChoices, setVisibleChoices] = useState<T[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [clearSelectedHover, setClearSelectedHover] = useState<boolean>(false);
  const [showToolTip, setShowToolTip] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
 
  useEffect(() => {
    state.selected = getSelection();
    updateVisibleChoices();
  },[props.selected])
  
  useEffect(() => {
    //detected when to close item list
    document.addEventListener("click", clickedAway, true);
    return () => {
      document.removeEventListener("click", clickedAway, true);
    };
  }, []);


  const getMatchItem = (item: T): string =>
    !props.caseSensitive ? getItemText(item).toLowerCase() : getItemText(item);

  //flag on change to parent
  const onChange = (items: T[]) => {
    if (props.onChange) {
      props.onChange(items);
    }
  };

  const onChangeSelection = (item?: T) => {
    if (props.onChange) {
      props.onChange(item);
    }
  };

  //Uses text input to fetche avialble choices from a cache or supplied lookup
  const fetchChoices = (text: string) => {
    if (props.typeAheadLookUp && (text !== "" || !props.noEmptyStringLookUp)) {
      state.lookedUpChoices = undefined;
      //if use cache then check if we have items
      if (state.cache) {
        try {
          const cachedItems = state.cache.getCachedItems(text);
          if (cachedItems) {
            updateChoices(cachedItems);
            return;
          }
        } catch (error) {
          console.log(
            `Failed to fetch items from cache, reason: ${errorMessage(error)}`
          );
        }
      }
      const guid = (state.token = generateGuid());
      //look item lookup
      props.typeAheadLookUp(text, state.selected).then((items) => {
        try {
          //if use cache then cache items
          if (state.cache) {
            state.cache.cacheItems(text, items);
          }
          //if call is current call set items
          if (guid === state.token) {
            updateChoices(items);
          } 
        } catch (error) {
          console.log(
            `Failed to fetch items from item source, reason: ${errorMessage(error)}`
          );
        }
      });
    }
  };

  //check if item should be filtered
  const shouldFilter = (item: T): boolean => {
    return getMatchItem(item).includes(
      !props.caseSensitive
        ? state.inputText.toLowerCase()
        : state.inputText
    );
  }
  //determine visible choices based on available choices and what is selected
  const getVisibleChoices = (): T[] => {
    try {
      //if not lookup choices availale and no choices supplied show selected items
      if (!state.lookedUpChoices && !props.choices) {
        return state.selected;
      }
      
      //filter out selected items and items that do not contain text input
      return state.selected.filter( item => !state.inputText || shouldFilter(item) ).concat(
        (state.lookedUpChoices ?? props.choices ?? []).filter(
          (item) =>
            state.selected.indexOf(item) === -1 &&
            (!state.inputText || shouldFilter(item))
        )
      );
    } catch (error) {
      console.log(
        `Failed to get visible choices, reason: ${errorMessage(error)}`
      );
    }
    return [];
  };

  //updates the text shown to user
  const updateDisplayText = () => {
    try {
      //show the currently selected item or number of selected items
      setDisplayText(getDisplayText(state.selected));
      setCaption(getCaption(state.selected));
    } catch (error) {
      console.log(
        `Failed to fetch update display text, reason: ${errorMessage(error)}`
      );
    }
  };

  //updates the visible item state
  const updateVisibleChoices = () => {
    state.visibleChoices = getVisibleChoices();
    if (state.highlightedIndex >= state.visibleChoices.length) {
      adjustHighlightedIndex(state.visibleChoices.length - 1);
    }
    setVisibleChoices(state.visibleChoices);
    updateDisplayText();
  };

  //updates the available choices from a lookup and calls visible choice update
  const updateChoices = (items: T[]) => {
    state.lookedUpChoices = items;
    updateVisibleChoices();
  };

  //calls parent notifier and visible choice update
  const updateSelected = () => {
    if( props.maximumSelections === 1) {
      onChangeSelection(state.selected.length > 0 ? state.selected[0] : undefined);
    } else {
      onChange(state.selected);
    }
    updateVisibleChoices();
  };

  //hides the list and clears the input choices
  const hideList = () => {
    state.showChoices = false;
    setShowChoices(false);
    updateInputText("");
  };

  //shows the list and sets the highlighted index to -1
  const showList = () => {
    state.showChoices = true;
    adjustHighlightedIndex(-1);
    setShowChoices(true);
    hideToolTip();
  };

  //document click handler
  const clickedAway = (mouseEvent: MouseEvent) => {
    if (!state.showChoices) {
      return;
    }
    try {
      //get the control
      const input = document.getElementById("csInput" + state.selectId);
      const list = document.getElementById("csList" + state.selectId);
      //check if the click was outside the controls area
      if (
        mouseEvent.target !== null &&
        !input?.contains(mouseEvent.target as Node) === true &&
        !list?.contains(mouseEvent.target as Node) === true
      ) {
        hideList();
      }
    } catch (error) {
      console.log(
        `Failed to handle click away, reason: ${errorMessage(error)}`
      );
    }
  };

  //update the text input into the input contorl
  const updateInputText = (text: string) => {
    state.inputText = text;
    setInputText(state.inputText);
  };

  //hanlder for clicking on the control
  const textInputClicked = () => {
    if (props.disabled) {
      return;
    }
    setTimeout(() => {
      console.log("setting focus")
      if( inputRefence.current ) {
        inputRefence.current.focus();
      }
    }, 100);
    //if list already shown do nothing.
    if (state.showChoices) {
      return;
    }
    //if behaving as a switch move to the next item in the list
    if (props.selectType === "switch") {
      try {
        if (props.choices) {
          var index =
            state.selected.length > 0
              ? props.choices.indexOf(state.selected[0]) + 1
              : 0;
          if (index + 1 >= props.choices.length) {
            index = 0;
          }
          state.selected = [props.choices[index]];
          updateSelected();
        }
      } catch (error) {
        console.log(
          `Failed to switch to next item, reason: ${errorMessage(error)}`
        );
      }
      return;
    }
    //clear the input text
    updateInputText("");
    //if items lookup provided then call it for default otherwise update visible choices.
    if (props.typeAheadLookUp) {
      fetchChoices("");
    } else {
      updateVisibleChoices();
    }
    //show the item list
    showList();
  };

  //called when text entered into the input control
  const textChanged = (event: ChangeEvent<HTMLInputElement>) => {
    //update text
    updateInputText(event.target.value);
    //if items lookup provided call it otherwise call updateVisiblechoices to filter items base on text
    if (props.typeAheadLookUp) {
      fetchChoices(event.target.value);
    } else {
      updateVisibleChoices();
    }
  };

  //called when a choice is clicked.
  const selectItem = (item: T) => {
    //if no maxium selections or number of selected items less than max, select the item
    if (
      !props.maximumSelections ||
      state.selected.length < props.maximumSelections
    ) {
      state.selected.push(item);
      updateSelected();
      //if a max of 1 item then selected only this item
    } else if (props.maximumSelections === 1) {
      state.selected[0] = item;
      updateSelected();
    }
    //if only 1 item allow and list a dropdown, close it
    if (
      props.maximumSelections === 1 &&
      (props.minimumSelections === 1 || props.selectType === "dropdown")
    ) {
      hideList();
    }
  };

  //called when a selected item is clicked
  const deselectItem = (item: T) => {
    try {
      // if the selected items greater than minimum then deslect
      if (state.selected.length > (props.minimumSelections ?? 0)) {
        const idx = state.selected.indexOf(item);
        state.selected.splice(idx, 1);
        updateSelected();
      }
    } catch (error) {
      console.log(
        `Failed to de selecte item, reason: ${errorMessage(error)}`
      );
    }
  };

  //called when clear all selected items clicked.
  const clearSelection = (event: ReactMouseEvent) => {
    if (props.disabled) {
      return;
    }
    
    setClearSelectedHover(false);
    state.selected = [];
    updateSelected();
    event.stopPropagation();
  };

  //makes highlighted item visible
  const makeItemVisible = (index: number) => {
    try {
      const input = document.getElementById(`item_${index}`);
      const list = document.getElementById("csList"  + state.selectId);
      if (input && list) {
        scrollIntoView(list, input);
      }
    } catch (error) {
      console.log(
        `Failed to make highlighted item visible, reason: ${errorMessage(error)}`
      );
    }
  };


  const findNextEnabled = (index: number): number => {
    while(index < state.visibleChoices.length && isDisabled(state.visibleChoices[index])) index++;
    return index;
  }

  const findPrevEnabled = (index: number): number => {
    while(index > 0 && isDisabled(state.visibleChoices[index])) index--;
    return index;
  }

  //updates the highlighted item index
  const adjustHighlightedIndex = (index: number) => {
    state.highlightedIndex = index;
    setHighlightedIndex(state.highlightedIndex);
    if (state.highlightedIndex !== -1) {
      makeItemVisible(state.highlightedIndex);
    }
  };

  //called when a key is pressed
  const inputKeyPressed = (event: KeyboardEvent<HTMLDivElement>) => {
    try {
      switch (event.code) {
        case "ArrowDown":
          //if the highlited item less than max move down
          if (
            showChoices &&
            visibleChoices.length > 0 &&
            state.highlightedIndex < visibleChoices.length - 1
          ) {
            if (state.highlightedIndex === -1) {
              initialiseHighlightedIndex();
            } else {
              const index = findNextEnabled(state.highlightedIndex + 1);
              adjustHighlightedIndex(index);
            }
          }
          break;
        case "ArrowUp":
          //if the highlited item greater than 0 move up
          if (
            showChoices &&
            visibleChoices.length > 0 &&
            state.highlightedIndex > 0
          ) {
            if (state.highlightedIndex === -1) {
              initialiseHighlightedIndex();
            } else {
              const index = findPrevEnabled(state.highlightedIndex - 1);
              adjustHighlightedIndex(index);
            }
          }
          break;
        case "Home":
          //move to start
          if (showChoices && visibleChoices.length > 0) {
            if (state.highlightedIndex === -1) {
              initialiseHighlightedIndex();
            } else {
              const index = findPrevEnabled(0);
              adjustHighlightedIndex(index);
            }
          }
          break;
        case "End":
          //move to end
          if (showChoices && visibleChoices.length > 0) {
            if (state.highlightedIndex === -1) {
              initialiseHighlightedIndex();
            } else {
              const index = findPrevEnabled(state.highlightedIndex-1);
              adjustHighlightedIndex(index);
            }
          }
          break;
        case "NumpadEnter":
        case "Enter":
          //select item
          if (
            highlightedIndex > -1 &&
            state.highlightedIndex < visibleChoices.length
          ) {
            if (
              state.selected.indexOf(visibleChoices[state.highlightedIndex]) ===
              -1
            ) {
              selectItem(visibleChoices[state.highlightedIndex]);
            } else {
              deselectItem(visibleChoices[state.highlightedIndex]);
            }
          }
          break;
      }
    } catch (error) {
      console.log(
        `Failed to hanle key press, reason: ${errorMessage(error)}`
      );
    }
  };

  //set the highlighted index to first unselected or if none the first selected
  const initialiseHighlightedIndex = () => {
    const choice = getFirstNonSelectedItem(
      state.lookedUpChoices && state.lookedUpChoices.length > 0
        ? state.lookedUpChoices
        : props.choices && props.choices.length > 0
        ? props.choices
        : []
    );
    if( choice ) {
      const index = findNextEnabled(visibleChoices.indexOf(choice));
      adjustHighlightedIndex(index);
    } else {
      adjustHighlightedIndex(0);
    }
  };

  //get the first non selected item
  const getFirstNonSelectedItem = (items: T[]): T | undefined => {
    for (let index = 0; index < items.length; index++) {
      if (state.selected.indexOf(items[index]) === -1) {
        return items[index];
      }
    }
    return undefined;
  };

  const pasteText = (event: ClipboardEvent) => {
    try {
      const text = event.clipboardData.getData("text");
      if (!text || text.indexOf(",") === -1) {
        return;
      }
      event.preventDefault();

      //get items from text, if not checking case convert to lower case
      const items = text.split(",").map((s) => s.trim());
      if (props.choices) {
        //if we have choices then search choices
        const searchItems = !props.caseSensitive
          ? items.map((s) => s.toLowerCase())
          : items;
        state.selected = state.selected.concat(
          props.choices.filter(
            (item) =>
              searchItems.indexOf(
                !props.caseSensitive 
                  ? getItemValueString(item).toLowerCase()
                  : getItemValueString(item)
              ) !== -1 && state.selected.indexOf(item) === -1
          )
        );
        if (
          props.maximumSelections &&
          state.selected.length >= props.maximumSelections
        ) {
          state.selected.splice(props.maximumSelections);
        }
        updateSelected();
      } else if (props.itemSearch) {
        //otherwise if we have a func to call, call it
        props.itemSearch(items).then((foundItems) => {
          state.selected = state.selected.concat(
            foundItems.filter(
              (item) =>
                !state.selected.find(
                  (sel) => getItemValue(sel) === getItemValue(item)
                )
            )
          );
          if (
            props.maximumSelections &&
            state.selected.length >= props.maximumSelections
          ) {
            state.selected.splice(props.maximumSelections);
          }
          updateSelected();
        });
      }
    } catch (error) {
      console.log(
        `Failed to paste items, reason: ${errorMessage(error)}`
      );
    }
  };

  const checkToolTip = () => {
    if(!showChoices) {
      setShowToolTip(true);
    }
  }

  const hideToolTip = () => {
    setShowToolTip(false);
  }

  const background = (): CSS.Properties =>
    props.disabled
      ? {
        backgroundColor: props.disableBackgroundColor ?? "Gainsboro",
        backgroundImage: props.disableBackgroundImage
      }
      : {
        backgroundColor: props.backgroundColor ?? "white",
        backgroundImage: props.backgroundImage
     };

  const compactSelectStyle = (): CSS.Properties => 
    props.disabled && props.selectDisabledStyle
    ? props.selectDisabledStyle 
    : props.selectStyle ?? {
      height: props.height,
      width: props.width,
      minWidth: props.maxWidth ?? "80px",
      maxWidth: props.maxWidth,
      borderColor: props.borderColor,
      borderRadius: props.borderRadius ?? "5px",
      border: props.border ?? "2px solid WhiteSmoke",
      ...background()
    };

  const clearSelectedStyle = (hovered: boolean): CSS.Properties => 
    props.disabled && props.clearSelectionDisabledStyle
    ? props.clearSelectionDisabledStyle 
    : hovered && props.clearSelectionHoverStyle
    ? props.clearSelectionHoverStyle
    : props.clearSelectionStyle ?? {
      color: props.disabled
        ? props.clearSelectionDisabledColor ?? props.disabledColor ?? "darkgray"
        : hovered
        ? props.clearSelectionHoverColor ?? "darkgray"
        : props.clearSelectionColor ?? props.color ?? "white",
      fontSize: props.clearSelectionSize ?? "large"
    };
  
  const inputStyle = (): CSS.Properties => 
    props.disabled && props.inputDisabledStyle 
    ? props.inputDisabledStyle
    : props.inputStyle ?? {
      color: props.disabled
        ? props.disabledColor ?? "darkgray"
        : props.color ?? "black",
      fontSize: props.fontSize,
      fontFamily: props.fontFamily ?? "unset",
      fontWeight: state.selected.length === 0 && (!showChoices || (!props.selectType || props.selectType !== 'standard')) 
        ? props.titleFontWeight ?? 100
        : props.fontWeight ?? 'bold',
      fontStyle: props.fontStyle,
    };

  const displayTextProps = () : DisplayProps<T> & DisplayStyle => {
    return {
      title: props.title,
      text: displayText,
      choicesShown: showChoices,
      selected: state.selected,
      selectType: props.selectType,
      disabled: props.disabled,
      ...(props as DisplayStyle)
    }
  }
  
  const titleDisplayStyle = (): CSS.Properties => 
    props.disabled && props.titleDisabledStyle 
    ? props.titleDisabledStyle
    : props. titleStyle ?? {
      color: props.disabled
        ? props.disabledTitleColor ?? "lightgray"
        : props.titleColor ?? props.color ?? "darkgray",
      fontSize: props.titleFontSize ?? props.fontSize ?? "small",
      fontFamily: props.titleFontFamily ?? props.fontFamily,
      fontWeight: props.titleFontWeight ?? props.fontWeight,
      fontStyle: props.titleFontStyle ?? props.fontStyle,
    };

  const listContainerStyle = (): CSS.Properties => 
    props.listStyle ?? {
      maxHeight: props.choiceListMaxHeight ?? "300px",
      borderColor: props.choiceListBorderColor ?? props.borderColor,
      borderRadius: props.choiceListBorderRadius ?? props.borderColor ?? "5px",
      border: props.choiceListBorder ?? props.border ?? "2px solid WhiteSmoke",
      backgroundColor: props.choiceListBackgroundColor ?? props.backgroundColor ?? "white",
      backgroundImage: props.choiceListBackgroundImage ?? props.backgroundImage,
    };

  const dropdownIconStyle = () : CSS.Properties => 
    props.disabled ?
      props.dropdownIcondisabledStyle ?? {
        color: props.dropdownIconDisabledColor ?? props.disabledColor
      } :
      props.dropdownIconStyle ?? {
        color: props.dropdownIconColor ?? props.color
      }
  

  const choiceAttributes: ChoiceStyle = {
    choiceFontFamily: props.choiceFontFamily ?? props.fontFamily,
    choiceFontStyle:  props.choiceFontStyle ?? props.fontStyle,
    choiceFontWeight: props.choiceFontWeight ?? props.fontWeight,
    choiceFontSize: props.choiceFontSize ?? props.fontSize,
    choiceColor: props.choiceColor ?? props.color,
    choiceHoverBackgroundColor: props.choiceHoverBackgroundColor ?? "#AFB1B6",
    choiceDisabledBackgroundColor: props.choiceDisabledBackgroundColor ?? props.disableBackgroundColor,
    choiceDisabledColor: props.choiceDisabledColor ?? props.disabledColor,
    ...(props as ChoiceStyle)
  }

  const tooltipAttibutes: ToolTipStyle = {
    toolTipFontFamily: props.toolTipFontFamily ?? props.fontFamily,
    toolTipFontStyle:  props.toolTipFontStyle ?? props.fontStyle,
    toolTipFontWeight: props.toolTipFontWeight ?? props.fontWeight,
    toolTipFontSize: props.toolTipFontSize ?? props.fontSize,
    toolTipColor: props.toolTipColor ?? props.color,
    ...(props as ToolTipStyle)
  }

  const className = (): string => 
    props.disabled && props.disabledClassName
      ? ` ${props.disabledClassName}`
      : props.className
      ? ` ${props.className}`
      : "";

  const inputClassName = (): string => 
    props.disabled && props.inputDisabledClassName
      ? ` ${props.inputDisabledClassName}`
      : props.inputClassName
      ? ` ${props.inputClassName}`
      : "";    
  
  const clearSelectionClassName = (): string => 
    props.disabled && props.clearSelectionDisabledClassName
      ? ` ${props.clearSelectionDisabledClassName}`
      : clearSelectedHover && props.clearSelectionHoverClassName
      ? ` ${props.clearSelectionHoverClassName}`
      : props.clearSelectionClassName
      ? ` ${props.clearSelectionClassName}`
      : ""; 
      
  const titleClassName = (): string => 
    props.disabled && props.titleDisabledClassName
      ? ` ${props.titleDisabledClassName}`
      : props.titleClassName
      ? ` ${props.titleClassName}`
      : ""; 

  const dropIconClassName = (): string => 
    props.disabled && props.dropIconDisabledClassName
      ? ` ${props.dropIconDisabledClassName}`
      : props.dropIconClassName
      ? ` ${props.dropIconClassName}`
      : ""; 

  const choiceProps = (highlighted: boolean, selected: boolean, item: T): ChoiceProps<T> & ChoiceStyle => {
    return {
      itemText: props.itemText,
      item: item,
      choiceSelected: selected,
      onSelected: selected ? deselectItem : selectItem,
      choiceHighlighted: highlighted,
      choiceDisabled: isDisabled(item),
      ...choiceAttributes
    }
  }

  const constructChoice = (highlighted: boolean, selected: boolean, item: T): JSX.Element => 
    props.choiceComponent 
    ? <div
        key={(highlighted ? "high-" : "") + ( selected ? "selected-" : "" ) + getItemValue(item)}
      >
      {
        props.choiceComponent({...choiceProps(highlighted, selected, item)})
      }
      </div>
    : <CompactSelectChoice
        key={ (highlighted ? "high-" : "") + ( selected ? "selected-" : "" ) + getItemValue(item) }
        {...choiceProps(highlighted, selected, item)}
      />

  const toolTip = (child: JSX.Element): JSX.Element => 
    props.toolTipComponent
    ? props.toolTipComponent({
      children: child,
      tip: caption,
      show: showToolTip,
      ...tooltipAttibutes
    })
    : <ToolTip
        children={child}
        tip={caption}
        show={showToolTip}
        {...tooltipAttibutes}
      />

  return (
    
    <div className={scssClasses.csWrapper}>
      {toolTip(
        <div
          className={scssClasses.csCompactSelect + className()}
          style={compactSelectStyle()}
          onKeyDownCapture={inputKeyPressed}
          onMouseEnter={checkToolTip}
          onMouseLeave={hideToolTip}
          onPaste={pasteText}
        >
          {(!props.maximumSelections || props.maximumSelections < 1) && state.selected.length > 0 && props.selectType !== "switch" && (
            <div
            className={scssClasses.csClearSelection} 
              style={clearSelectedStyle(clearSelectedHover)}
              onMouseEnter={() => setClearSelectedHover(true)}
              onMouseLeave={() => setClearSelectedHover(false)}
              onClick={clearSelection}
            >
              {props.clearSelectionIcon ? (
                <props.clearSelectionIcon
                  className={clearSelectionClassName()}
                />
              ) : (
                <TiDeleteOutline
                  className={clearSelectionClassName()}
                />
              )}
            </div>
          )}
          <div 
            className={scssClasses.csMainDisplay} 
            onClick={textInputClicked}>
            <div className={scssClasses.csTextWrapper}>
              {showChoices && (!props.selectType || props.selectType === "standard") ? 
                <input
                  ref={inputRefence}
                  id={"csInput" + state.selectId}
                  className={scssClasses.csInput + inputClassName()}
                  style={inputStyle()}
                  value={showChoices ? inputText : displayText === "" ? props.title :  displayText}
                  disabled={props.disabled}
                  spellCheck="false"
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  onChange={textChanged}
                />
              : props.displayComponent 
                ? props.displayComponent(displayTextProps()) 
                : <CompactSelectDisplay 
                    {...displayTextProps()}
                  />
              }
            </div>
            {!showChoices && !props.hideDropdownIcon && props.selectType !== "switch" && (
              <div 
                className={scssClasses.csDropDownIcon}
                style={dropdownIconStyle()}
              >
                {props.dropdownIcon ? (
                  <props.dropdownIcon
                    className={dropIconClassName()}
                  />
                ) : (
                  <RiArrowDropDownFill
                  className={dropIconClassName()}
                  />
                )}
              </div>
            )}
          </div>
          {(showChoices || displayText !== "") && !props.hideTitle && (
            <p 
              className={scssClasses.csSelectTitle + titleClassName()} 
              style={titleDisplayStyle()}
            >
              {props.title}
            </p>
          )}
          {!props.disabled && showChoices && (
            <div
              id={"csList" + state.selectId}
              className={scssClasses.csChoiceContainer  + (props.choiceListClassName ? ` ${props.choiceListClassName}` : "")}
              style={listContainerStyle()}
            >
              <ul className={scssClasses.csChoiceList}>
                {visibleChoices.length > 0 &&
                  visibleChoices.map((item, index) => (
                    <li
                      id={`item_${index}`}
                      key={`item_${index}`}
                      onMouseOverCapture={() => adjustHighlightedIndex(index)}
                    >
                      {
                        constructChoice(highlightedIndex === index, state.selected.indexOf(item) !== -1, item)
                      }
                    </li>
                  ))}
                {visibleChoices.length === 0 && !props.choices && !state.lookedUpChoices && (
                  <p 
                    className={scssClasses.csLoading + (props.loadingTextClassName ? ` ${props.loadingTextClassName}` : "")}
                    style={{color: props.choiceColor ?? props.color}}
                  >
                    {props.loadingText ?? "Loading..."}
                  </p>
                )}
                {props.choices?.length === 0 && state.lookedUpChoices && (
                  <p 
                    className={scssClasses.csLoading + (props.loadingTextClassName ? ` ${props.loadingTextClassName}` : "")}
                    style={{color: props.choiceColor ?? props.color}}
                  >
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
