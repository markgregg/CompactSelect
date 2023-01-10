import {
  useRef,
  RefObject,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ClipboardEvent,
} from "react";
import { Cache, createCache } from "../cache/cache";
import { errorMessage } from "../utils/domUtils";
import { generateGuid } from "../utils/guidGenerator";
import { scrollIntoView } from "../utils/domUtils";
import {
  Choice,
  SelectProps,
} from "../types";
import"./CompactSelect.css";

export interface CompactSelectModel<T extends Choice | object | string> {
  inputRef: RefObject<HTMLInputElement>;
  token: string;
  inputText: string;
  filterText: string;
  showChoices: boolean;
  lookedUpChoices?: T[];
  selected: T[];
  visibleChoices: T[];
  cache?: Cache<T>;
  highlightedIndex: number;
  selectId: string;
  showToolTip: boolean;
  displayText: string;
  caption: string;
  updateDisplay: () => void;
}

export interface CompactSelectFunctions {
  getSelection: <T extends Choice | object | string>(props: SelectProps<T>) => T[];
  toolTipLimit: <T extends Choice | object | string>(props: SelectProps<T>) => number;
  onChange: <T extends Choice | object | string>(items: T[], props: SelectProps<T>) => void;
  getItemText: <T extends Choice | object | string>(item: T, props: SelectProps<T>) => string;
  getItemValue: <T extends Choice | object | string>(item: T, props: SelectProps<T>) => any;
  getItemValueString: <T extends Choice | object | string>(item: T, props: SelectProps<T>) => string;
  isDisabled: <T extends Choice | object | string>(item: T, props: SelectProps<T>) => boolean;
  fetchChoices: <T extends Choice | object | string>(text: string, model: CompactSelectModel<T>, props: SelectProps<T>) => void;
  shouldFilter: <T extends Choice | object | string>(item: T, model: CompactSelectModel<T>, props: SelectProps<T>) => boolean;
  getVisibleChoices: <T extends Choice | object | string>(model: CompactSelectModel<T>, props: SelectProps<T>) => T[];
  updateDisplayText: <T extends Choice | object | string>(model: CompactSelectModel<T>, props: SelectProps<T>) => void;
  updateVisibleChoices: <T extends Choice | object | string>(model: CompactSelectModel<T>, props: SelectProps<T>) => void;
  updateChoices: <T extends Choice | object | string>(items: T[], model: CompactSelectModel<T>, props: SelectProps<T>) => void;
  updateSelected: <T extends Choice | object | string>(model: CompactSelectModel<T>, props: SelectProps<T>) => void;
  hideList: <T extends Choice | object | string>(model: CompactSelectModel<T>) => void;
  showList: <T extends Choice | object | string>(model: CompactSelectModel<T>, props: SelectProps<T>) => void;
  clickedAway: <T extends Choice | object | string>(mouseEvent: MouseEvent, model: CompactSelectModel<T>) => void;
  textInputClicked: <T extends Choice | object | string>(model: CompactSelectModel<T>, props: SelectProps<T>) => void;
  textChanged: <T extends Choice | object | string>(event: ChangeEvent<HTMLInputElement>, model: CompactSelectModel<T>, props: SelectProps<T>) => void;
  selectItem: <T extends Choice | object | string>(item: T, model: CompactSelectModel<T>, props: SelectProps<T>) => void;
  deselectItem: <T extends Choice | object | string>(item: T, model: CompactSelectModel<T>, props: SelectProps<T>) => void;
  makeItemVisible: <T extends Choice | object | string>(index: number, model: CompactSelectModel<T>) => void;
  findNextEnabled: <T extends Choice | object | string>(index: number,model: CompactSelectModel<T>, props: SelectProps<T>) => number;
  findPrevEnabled: <T extends Choice | object | string>(index: number,model: CompactSelectModel<T>, props: SelectProps<T>) => number;
  adjustHighlightedIndex: <T extends Choice | object | string>(index: number, model: CompactSelectModel<T>) => void;
  adjustHighlightedIndexOnly: <T extends Choice | object | string>(index: number, model: CompactSelectModel<T>) => void;
  inputKeyPressed: <T extends Choice | object | string>(event: KeyboardEvent<HTMLDivElement>, model: CompactSelectModel<T>, props: SelectProps<T>) => void;
  pasteText: <T extends Choice | object | string>(event: ClipboardEvent, model: CompactSelectModel<T>, props: SelectProps<T>) => void;
  checkToolTip: <T extends Choice | object | string>(model: CompactSelectModel<T>) => void;
  hideToolTip: <T extends Choice | object | string>(model: CompactSelectModel<T>) => void;
  clearSelection: <T extends Choice | object | string>(event: ReactMouseEvent, model: CompactSelectModel<T>, props: SelectProps<T>) => void;
  getDisplayText: <T extends Choice | object | string>(selection: T[], props: SelectProps<T>) => string;
  getCaption: <T extends Choice | object | string>(selection: T[], props: SelectProps<T>) => string;
  getMatchItem: <T extends Choice | object | string>(item: T, props: SelectProps<T>) => string;
  createCompactSelectModel: <T extends Choice | object | string> (props: CompactSelectModelProps<T>) => CompactSelectModel<T>;
}

export interface CompactSelectModelProps<T extends Choice | object | string> extends SelectProps<T> {
  refresh: (unique: number) => void;
}

const defaultToolTipLimit = 20;

export const compactSelectModelFunctions: CompactSelectFunctions = {
  
  getSelection: <T extends Choice | object | string>(props: SelectProps<T>): T[] => {
    try {
      if (
        props.selectType === "switch" ||
        (props.maximumSelections === 1 && props.minimumSelections === 1)
      ) {
        if (
          props.selected &&
          Array.isArray(props.selected) &&
          props.selected.length > 0
        ) {
          return [props.selected[0]];
        }
        if (props.selected && typeof props.selected === "string") {
          return [props.selected];
        }
        if (props.choices && props.choices.length > 0) {
          return [props.choices[0]];
        }
        return [];
      }
      return props.selected && Array.isArray(props.selected)
        ? props.selected
        : props.selected && !Array.isArray(props.selected)
        ? [props.selected as T]
        : [];
    } catch (error) {
      console.log(`Failed to fetch selection, reason: ${errorMessage(error)}`);
    }
    return [];
  },

  toolTipLimit: <T extends Choice | object | string>(props: SelectProps<T>): number => {
    return props.toolTipValueLimit ?? defaultToolTipLimit;
  },
  
  onChange: <T extends Choice | object | string>(items: T[], props: SelectProps<T>) => {
    if (props.onChange) {
      props.onChange([...items]);
    }
  },

  getItemText: <T extends Choice | object | string>(item: T, props: SelectProps<T>): string => {
    try {
      return (
        (item as Choice).text ??
        (props.itemText ? props.itemText(item) : (item as string))
      );
    } catch (error) {
      console.log(
        `Object type either does not implement Choice, the property getters (itemText | itemValue) or is not a string, error: ${errorMessage(
          error
        )}`
      );
    }
    return "";
  },

  getItemValue: <T extends Choice | object | string>(item: T, props: SelectProps<T>): any => {
    try {
      return (
        (item as Choice).value ??
        (props.itemValue ? props.itemValue(item) : item)
      );
    } catch (error) {
      console.log(
        `Object type either does not implement Choice, the property getter (itemText) or is not a string, error: ${errorMessage(
          error
        )}`
      );
    }
    return "";
  },

  //returns value of an item
  getItemValueString: <T extends Choice | object | string>(item: T, props: SelectProps<T>): string => {
    try {
      const value =
        (item as Choice).value ??
        (props.itemValue ? props.itemValue(item) : item);
      return typeof value === "string" ? value : value.toString();
    } catch (error) {
      console.log(
        `Object type either does not implement Choice, the property getter (itemValue) or is not a string, error: ${errorMessage(
          error
        )}`
      );
    }
    return "";
  },

  //returns disabled property of an item
  isDisabled: <T extends Choice | object | string>(item: T, props: SelectProps<T>): boolean => {
    try {
      return (
        (item as Choice).disabled ??
        (props.itemDisabled ? props.itemDisabled(item) : false)
      );
    } catch (error) {
      console.log(
        `Object type either does not implement Choice, the property getter (disabled) or is not a string, error: ${errorMessage(
          error
        )}`
      );
    }
    return false;
  },

  fetchChoices: <T extends Choice | object | string>(text: string, model: CompactSelectModel<T>, props: SelectProps<T>) => {
    if (props.typeAheadLookUp && (text !== "" || !props.noEmptyStringLookUp)) {
      model.lookedUpChoices = undefined;
      //if use cache then check if we have items
      if (model.cache) {
        try {
          const cachedItems = model.cache.getCachedItems(text);
          if (cachedItems) {
            compactSelectModelFunctions.updateChoices(cachedItems, model, props);
            return;
          }
        } catch (error) {
          console.log(
            `Failed to fetch items from cache, reason: ${errorMessage(error)}`
          );
        }
      }
      const guid = (model.token = generateGuid());
      //look item lookup
      props.typeAheadLookUp(text, model.selected).then((items) => {
        try {
          //if use cache then cache items
          if (model.cache) {
            model.cache.cacheItems(text, items);
          }
          //if call is current call set items
          if (guid === model.token) {
            compactSelectModelFunctions.updateChoices(items, model, props);
          }
        } catch (error) {
          console.log(
            `Failed to fetch items from item source, reason: ${errorMessage(
              error
            )}`
          );
        }
      });
    }
  },

  //check if item should be filtered
  shouldFilter: <T extends Choice | object | string>(item: T, model: CompactSelectModel<T>, props: SelectProps<T>): boolean => {
    return compactSelectModelFunctions.getMatchItem(item, props).includes(
      !props.caseSensitive ? model.inputText.toLowerCase() : model.inputText
    );
  },

  //determine visible choices based on available choices and what is selected
  getVisibleChoices: <T extends Choice | object | string>(model: CompactSelectModel<T>, props: SelectProps<T>): T[] => {
    try {
      //if not lookup choices availale and no choices supplied show selected items
      if (!model.lookedUpChoices && !props.choices) {
        return model.selected;
      }

      //filter out selected items and items that do not contain text input
      return model.selected
        .filter((item) => !model.inputText || compactSelectModelFunctions.shouldFilter(item, model,props))
        .concat(
          (model.lookedUpChoices ?? props.choices ?? []).filter(
            (item) =>
              model.selected.indexOf(item) === -1 &&
              (!model.inputText || compactSelectModelFunctions.shouldFilter(item, model,props))
          )
        );
    } catch (error) {
      console.log(
        `Failed to get visible choices, reason: ${errorMessage(error)}`
      );
    }
    return [];
  },

  //updates the text shown to user
  updateDisplayText: <T extends Choice | object | string>(model: CompactSelectModel<T>, props: SelectProps<T>) => {
    try {
      //show the currently selected item or number of selected items
      model.displayText = compactSelectModelFunctions.getDisplayText(model.selected, props);
      model.caption = compactSelectModelFunctions.getCaption(model.selected, props);
    } catch (error) {
      console.log(
        `Failed to fetch update display text, reason: ${errorMessage(error)}`
      );
    }
  },

  //updates the visible item state
  updateVisibleChoices: <T extends Choice | object | string>(model: CompactSelectModel<T>, props: SelectProps<T>) => {
    model.visibleChoices = compactSelectModelFunctions.getVisibleChoices(model, props);
    if( model.visibleChoices.length === 0 ) {
      compactSelectModelFunctions.adjustHighlightedIndex(-1, model);
    } else if (model.highlightedIndex >= model.visibleChoices.length) {
      compactSelectModelFunctions.adjustHighlightedIndex(model.visibleChoices.length - 1, model);
    } else if( model.highlightedIndex === -1 ) {
      compactSelectModelFunctions.adjustHighlightedIndex(0,model);
    }
    compactSelectModelFunctions.updateDisplayText(model, props);
  },

  //updates the available choices from a lookup and calls visible choice update
  updateChoices: <T extends Choice | object | string>(items: T[], model: CompactSelectModel<T>, props: SelectProps<T>) => {
    model.lookedUpChoices = items;
    compactSelectModelFunctions.updateVisibleChoices(model, props);
    model.updateDisplay();
  },

  //calls parent notifier and visible choice update
  updateSelected: <T extends Choice | object | string>(model: CompactSelectModel<T>, props: SelectProps<T>) => {
    compactSelectModelFunctions.onChange(model.selected, props);
    compactSelectModelFunctions.updateVisibleChoices(model, props);
  },

  //hides the list and clears the input choices
  hideList: <T extends Choice | object | string>(model: CompactSelectModel<T>) => {
    model.showChoices = false;
    model.updateDisplay();
  },

  //shows the list and sets the highlighted index to -1
  showList: <T extends Choice | object | string>(model: CompactSelectModel<T>, props: SelectProps<T>) => {
    model.lookedUpChoices = undefined;
    model.inputText = "";
    compactSelectModelFunctions.updateVisibleChoices(model, props);
    model.showChoices = true;
    compactSelectModelFunctions.adjustHighlightedIndex(model.visibleChoices.length > 0 ? 0 : -1, model);
    model.showChoices = true;
    compactSelectModelFunctions.hideToolTip(model);
    model.updateDisplay();
  },

  //document click handler
  clickedAway: <T extends Choice | object | string>(mouseEvent: MouseEvent, model: CompactSelectModel<T>) => {
    if (!model.showChoices) {
      return;
    }
    try {
      //get the control
      const input = document.getElementById("csInput" + model.selectId);
      const list = document.getElementById("csList" + model.selectId);
      //check if the click was outside the controls area
      if (
        mouseEvent.target !== null &&
        !input?.contains(mouseEvent.target as Node) === true &&
        !list?.contains(mouseEvent.target as Node) === true
      ) {
        compactSelectModelFunctions.hideList(model);
      }
    } catch (error) {
      console.log(
        `Failed to handle click away, reason: ${errorMessage(error)}`
      );
    }
  },
  
  //hanlder for clicking on the control
  textInputClicked: <T extends Choice | object | string>(model: CompactSelectModel<T>, props: SelectProps<T>) => {
    if (props.disabled) {
      return;
    }
    setTimeout(() => {
      if (model.inputRef.current) {
        model.inputRef.current.focus();
      }
    }, 100);
    //if list already shown do nothing.
    if (model.showChoices) {
      return;
    }
    //if behaving as a switch move to the next item in the list
    if (props.selectType === "switch") {
      try {
        if (props.choices) {
          var index =
            model.selected.length > 0
              ? props.choices.indexOf(model.selected[0]) + 1
              : 0;
          if (index + 1 > props.choices.length) {
            index = 0;
          }
          model.selected = [props.choices[index]];
          compactSelectModelFunctions.updateSelected(model, props);
          model.updateDisplay();
        }
      } catch (error) {
        console.log(
          `Failed to switch to next item, reason: ${errorMessage(error)}`
        );
      }
      return;
    }
    //clear the input text
    model.inputText = "";
    //if items lookup provided then call it for default otherwise update visible choices.
    if (props.typeAheadLookUp) {
      compactSelectModelFunctions.fetchChoices("", model, props);
    } else {
      compactSelectModelFunctions.updateVisibleChoices(model, props);
    }
    //show the item list
    compactSelectModelFunctions.showList(model, props);
  },

  //called when text entered into the input control
  textChanged: <T extends Choice | object | string>(event: ChangeEvent<HTMLInputElement>, model: CompactSelectModel<T>, props: SelectProps<T>) => {
    //update text
    model.inputText = event.target.value;
    //if items lookup provided call it otherwise call updateVisiblechoices to filter items base on text
    if (props.typeAheadLookUp) {
      compactSelectModelFunctions.fetchChoices(event.target.value, model, props);
    } else {
      compactSelectModelFunctions.updateVisibleChoices(model, props);
    }
    model.updateDisplay();
  },

  //called when a choice is clicked.
  selectItem: <T extends Choice | object | string>(item: T, model: CompactSelectModel<T>, props: SelectProps<T>) => {
    //if no maxium selections or number of selected items less than max, select the item
    if (
      !props.maximumSelections ||
      model.selected.length < props.maximumSelections
    ) {
      model.selected.push(item);
      compactSelectModelFunctions.updateSelected(model, props);
      //if a max of 1 item then selected only this item
    } else if (props.maximumSelections === 1) {
      model.selected[0] = item;
      compactSelectModelFunctions.updateSelected(model, props);
    }
    //if only 1 item allow and list a dropdown, close it
    if (
      (props.maximumSelections === 1 &&
      (props.minimumSelections === 1 || props.selectType === "dropdown")) || 
      props.hideListOnSelect
    ) {
      compactSelectModelFunctions.hideList(model);
    } else {
      model.updateDisplay();
    }
  },

  //called when a selected item is clicked
  deselectItem: <T extends Choice | object | string>(item: T, model: CompactSelectModel<T>, props: SelectProps<T>) => {
    try {
      // if the selected items greater than minimum then deslect
      if (model.selected.length > (props.minimumSelections ?? 0)) {
        const idx = model.selected.indexOf(item);
        model.selected.splice(idx, 1);
        compactSelectModelFunctions.updateSelected(model, props);
        if( props.hideListOnSelect ) {
          compactSelectModelFunctions.hideList(model);
        } else {
          model.updateDisplay();
        }
      }
    } catch (error) {
      console.log(`Failed to de selecte item, reason: ${errorMessage(error)}`);
    }
  },

  //called when clear all selected items clicked.
  clearSelection: <T extends Choice | object | string>(event: ReactMouseEvent, model: CompactSelectModel<T>, props: SelectProps<T>) => {
    if (props.disabled) {
      return;
    }
    model.selected = [];
    model.updateDisplay();
    compactSelectModelFunctions.updateSelected(model, props);
    event.stopPropagation();
  },

  //makes highlighted item visible
  makeItemVisible: <T extends Choice | object | string>(index: number, model: CompactSelectModel<T>) => {
    try {
      const input = document.getElementById(`item_${index}`);
      const list = document.getElementById("csList" + model.selectId);
      if (input && list) {
        scrollIntoView(list, input);
      }
    } catch (error) {
      console.log(
        `Failed to make highlighted item visible, reason: ${errorMessage(
          error
        )}`
      );
    }
  },

  findNextEnabled: <T extends Choice | object | string>(index: number,model: CompactSelectModel<T>, props: SelectProps<T>): number => {
    while (
      index < model.visibleChoices.length &&
      compactSelectModelFunctions.isDisabled(model.visibleChoices[index], props)
    )
      index++;
    return index;
  },

  findPrevEnabled: <T extends Choice | object | string>(index: number, model: CompactSelectModel<T>, props: SelectProps<T>): number => {
    while (index > 0 && compactSelectModelFunctions.isDisabled(model.visibleChoices[index], props)) index--;
    return index;
  },

  //updates the highlighted item index
  adjustHighlightedIndex: <T extends Choice | object | string>(index: number, model: CompactSelectModel<T>) => {
    model.highlightedIndex = index;
    if (model.highlightedIndex !== -1) {
      compactSelectModelFunctions.makeItemVisible(model.highlightedIndex, model);
    }
  },

  adjustHighlightedIndexOnly: <T extends Choice | object | string>(index: number, model: CompactSelectModel<T>) => {
    model.highlightedIndex = index;
    if (model.highlightedIndex !== -1) {
      compactSelectModelFunctions.makeItemVisible(model.highlightedIndex,model);
    }
    model.updateDisplay();
  },

  //called when a key is pressed
  inputKeyPressed: <T extends Choice | object | string>(event: KeyboardEvent<HTMLDivElement>, model: CompactSelectModel<T>, props: SelectProps<T>) => {
    try {
      switch (event.code) {
        case "ArrowDown":
          //if the highlited item less than max move down
          if (
            model.showChoices &&
            model.visibleChoices.length > 0
          ) {
            const index = (model.highlightedIndex === -1 || model.highlightedIndex >= model.visibleChoices.length - 1)
              ? compactSelectModelFunctions.findNextEnabled(0, model, props)
              : compactSelectModelFunctions.findNextEnabled(model.highlightedIndex + 1, model, props);
              compactSelectModelFunctions.adjustHighlightedIndexOnly(index, model);
          }
          event.preventDefault();
          break;
        case "ArrowUp":
          //if the highlited item greater than 0 move up
          if (
            model.showChoices &&
            model.visibleChoices.length > 0
          ) {
            const index = (model.highlightedIndex <= -1)
              ? compactSelectModelFunctions.findPrevEnabled(model.visibleChoices.length - 1, model, props)
              : compactSelectModelFunctions.findPrevEnabled(model.highlightedIndex - 1,model, props);
              compactSelectModelFunctions.adjustHighlightedIndexOnly(index, model);
          }
          event.preventDefault();
          break;
        case "Home":
          //move to start
          if (model.showChoices && model.visibleChoices.length > 0) {
            const index = compactSelectModelFunctions.findNextEnabled(0, model, props);
            compactSelectModelFunctions. adjustHighlightedIndexOnly(index, model);
          }
          event.preventDefault();
          break;
        case "End":
          //move to end
          if (model.showChoices && model.visibleChoices.length > 0) {
            const index = compactSelectModelFunctions.findPrevEnabled(model.visibleChoices.length - 1, model, props);
            compactSelectModelFunctions.adjustHighlightedIndexOnly(index, model);
          }
          event.preventDefault();
          break;
        case "NumpadEnter":
        case "Enter":
          //select item
          if (
            model.highlightedIndex > -1 &&
            model.highlightedIndex < model.visibleChoices.length
          ) {
            if (
              model.selected.indexOf(model.visibleChoices[model.highlightedIndex]) ===
              -1
            ) {
              compactSelectModelFunctions.selectItem(model.visibleChoices[model.highlightedIndex], model, props);
              
            } else {
              compactSelectModelFunctions.deselectItem(model.visibleChoices[model.highlightedIndex], model, props);
            }
            if( props.clearInputOnSelect ) {
              model.inputText = "";
            }
          }
          event.preventDefault();
          break;
      }
    } catch (error) {
      console.log(`Failed to hanle key press, reason: ${errorMessage(error)}`);
    }
  },
  
  pasteText: <T extends Choice | object | string>(event: ClipboardEvent, model: CompactSelectModel<T>, props: SelectProps<T>) => {
    try {
      const text = event.clipboardData.getData("text");
      if (!text || text.indexOf(",") === -1) {
        return;
      }
      event.preventDefault();

      //get items from text, if not checking case convert to lower case
      const items = text.split(",").map((s) => s.trim());
      if (props.choices && props.choices.length > 0) {
        //if we have choices then search choices
        const searchItems = !props.caseSensitive
          ? items.map((s) => s.toLowerCase())
          : items;
        model.selected = model.selected.concat(
          props.choices.filter(
            (item) =>
              searchItems.indexOf(
                !props.caseSensitive
                  ? compactSelectModelFunctions.getItemValueString(item, props).toLowerCase()
                  : compactSelectModelFunctions.getItemValueString(item, props)
              ) !== -1 && model.selected.indexOf(item) === -1
          )
        );
        if (
          props.maximumSelections &&
          model.selected.length >= props.maximumSelections
        ) {
          model.selected.splice(props.maximumSelections);
        }
        compactSelectModelFunctions.updateSelected(model, props);
        model.updateDisplay();
      } else if (props.itemSearch) {
        //otherwise if we have a func to call, call it
        props.itemSearch(items).then((foundItems) => {
          model.selected = model.selected.concat(
            foundItems.filter(
              (item) =>
                !model.selected.find(
                  (sel) => compactSelectModelFunctions.getItemValue(sel, props) === compactSelectModelFunctions.getItemValue(item, props)
                )
            )
          );
          if (
            props.maximumSelections &&
            model.selected.length >= props.maximumSelections
          ) {
            model.selected.splice(props.maximumSelections);
          }
          compactSelectModelFunctions.updateSelected(model, props);
          model.updateDisplay();
        });
      }
    } catch (error) {
      console.log(`Failed to paste items, reason: ${errorMessage(error)}`);
    }
  },

  checkToolTip: <T extends Choice | object | string>(model: CompactSelectModel<T>) => {
    if (!model.showChoices) {
      model.showToolTip = true;
      model.updateDisplay();
    }
  },

  hideToolTip: <T extends Choice | object | string>(model: CompactSelectModel<T>) => {
    model.showToolTip = false;
    model.updateDisplay();
  },

  getDisplayText: <T extends Choice | object | string>(selection: T[], props: SelectProps<T>): string => {
    try {
      return selection.length > 1
        ? `${selection.length} items`
        : selection.length === 1
        ? compactSelectModelFunctions.getItemText(selection[0], props)
        : "";
    } catch (error) {
      console.log(
        `Failed to fetch display text, reason: ${errorMessage(error)}`
      );
      return "";
    }
  },

  getCaption: <T extends Choice | object | string>(selection: T[], props: SelectProps<T>): string => {
    try {
      return selection.length > 1
        ? selection
            .slice(0, compactSelectModelFunctions.toolTipLimit(props))
            .map((item) => compactSelectModelFunctions.getItemText(item,props))
            .join(", ") +
            (selection.length > compactSelectModelFunctions.toolTipLimit(props)
              ? ` + ${selection.length - compactSelectModelFunctions.toolTipLimit(props)} more items`
              : "")
        : "";
    } catch (error) {
      console.log(
        `Failed to fetch caption text, reason: ${errorMessage(error)}`
      );
      return "";
    }
  },

  getMatchItem: <T extends Choice | object | string>(item: T, props: SelectProps<T>): string => {
    return !props.caseSensitive ? compactSelectModelFunctions.getItemText(item, props).toLowerCase() : compactSelectModelFunctions.getItemText(item,props);
  },

  createCompactSelectModel: <T extends Choice | object | string> (props: CompactSelectModelProps<T>) : CompactSelectModel<T> => {
    const model: CompactSelectModel<T> = {
      inputRef: useRef<HTMLInputElement>(null),
      token: "",
      selected: compactSelectModelFunctions.getSelection(props),
      inputText: "",
      filterText: "",
      showChoices: false,
      visibleChoices: [],
      lookedUpChoices: [],
      highlightedIndex: -1,
      showToolTip: false,
      displayText: "",
      caption: "",
      cache: props.cacheLookUp
        ? createCache<T>(
            props.title,
            props.cacheTimeToLive,
            props.cacheExpiryCheck
          )
        : undefined,
      selectId: generateGuid(),
      updateDisplay: () => {
        props.refresh(performance.now());
      }
    }
    return model;
  },
}