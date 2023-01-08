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

  updateSelection: (selection:  T[] | T | undefined) => void;
  getItemText: (item: T) => string;
  getItemValue: (item: T) => any;
  getItemValueString: (item: T) => string;
  isDisabled: (item: T) => boolean;
  fetchChoices: (text: string) => void;
  shouldFilter: (item: T) => boolean;
  getVisibleChoices: () => T[];
  updateDisplayText: () => void;
  updateVisibleChoices: () => void;
  updateChoices: (items: T[]) => void;
  updateSelected: () => void;
  hideList: () => void;
  showList: () => void;
  clickedAway: (mouseEvent: MouseEvent) => void;
  textInputClicked: () => void;
  textChanged: (event: ChangeEvent<HTMLInputElement>) => void;
  selectItem: (item: T) => void;
  deselectItem: (item: T) => void;
  makeItemVisible: (index: number) => void;
  findNextEnabled: (index: number) => number;
  findPrevEnabled: (index: number) => number;
  adjustHighlightedIndex: (index: number) => void;
  adjustHighlightedIndexOnly: (index: number) => void;
  inputKeyPressed: (event: KeyboardEvent<HTMLDivElement>) => void;
  pasteText: (event: ClipboardEvent) => void;
  checkToolTip: () => void;
  hideToolTip: () => void;
  clearSelection: (event: ReactMouseEvent) => void;
  getDisplayText: (selection: T[]) => string;
  getCaption: (selection: T[]) => string;
  getMatchItem: (item: T) => string;
}

export interface CompactSelectModelProps<T extends Choice | object | string> extends SelectProps<T> {
  refresh: (unique: number) => void;
}

const defaultToolTipLimit = 20;
export const createCompactSelectModel = <T extends Choice | object | string> (props: CompactSelectModelProps<T>) : CompactSelectModel<T> => {

  const updateDisplay = () => {
    props.refresh(performance.now());
  }

  const getSelection = (selection: T[] | T | undefined): T[] => {
    try {
      if (
        props.selectType === "switch" ||
        (props.maximumSelections === 1 && props.minimumSelections === 1)
      ) {
        if (
          selection &&
          Array.isArray(selection) &&
          selection.length > 0
        ) {
          return [selection[0]];
        }
        if (selection && typeof selection === "string") {
          return [selection];
        }
        if (props.choices && props.choices.length > 0) {
          return [props.choices[0]];
        }
        return [];
      }
      return selection && Array.isArray(selection)
        ? selection
        : selection && !Array.isArray(selection)
        ? [selection as T]
        : [];
    } catch (error) {
      console.log(`Failed to fetch selection, reason: ${errorMessage(error)}`);
    }
    return [];
  };

  const toolTipLimit = (): number =>
    props.toolTipValueLimit ?? defaultToolTipLimit;

  
  //flag on change to parent
  const onChange = (items: T[]) => {
    if (props.onChange) {
      props.onChange([...items]);
    }
  };

  const model: CompactSelectModel<T> = {
    inputRef: useRef<HTMLInputElement>(null),
    token: "",
    selected: getSelection(props.selected),
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

    updateSelection: (selection:  T[] | T | undefined) => {
      model.selected = getSelection(selection);
      updateDisplay();
    },

    getItemText: (item: T): string => {
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
  
    getItemValue: (item: T): any => {
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
    getItemValueString: (item: T): string => {
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
    isDisabled: (item: T): boolean => {
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

    fetchChoices: (text: string) => {
      if (props.typeAheadLookUp && (text !== "" || !props.noEmptyStringLookUp)) {
        model.lookedUpChoices = undefined;
        //if use cache then check if we have items
        if (model.cache) {
          try {
            const cachedItems = model.cache.getCachedItems(text);
            if (cachedItems) {
              model.updateChoices(cachedItems);
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
              model.updateChoices(items);
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
    shouldFilter: (item: T): boolean => {
      return model.getMatchItem(item).includes(
        !props.caseSensitive ? model.inputText.toLowerCase() : model.inputText
      );
    },

    //determine visible choices based on available choices and what is selected
    getVisibleChoices: (): T[] => {
      try {
        //if not lookup choices availale and no choices supplied show selected items
        if (!model.lookedUpChoices && !props.choices) {
          return model.selected;
        }
  
        //filter out selected items and items that do not contain text input
        return model.selected
          .filter((item) => !model.inputText || model.shouldFilter(item))
          .concat(
            (model.lookedUpChoices ?? props.choices ?? []).filter(
              (item) =>
                model.selected.indexOf(item) === -1 &&
                (!model.inputText || model.shouldFilter(item))
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
    updateDisplayText: () => {
      try {
        //show the currently selected item or number of selected items
        model.displayText = model.getDisplayText(model.selected);
        model.caption = model.getCaption(model.selected);
      } catch (error) {
        console.log(
          `Failed to fetch update display text, reason: ${errorMessage(error)}`
        );
      }
    },
  
    //updates the visible item state
    updateVisibleChoices: () => {
      model.visibleChoices = model.getVisibleChoices();
      if( model.visibleChoices.length === 0 ) {
        model.adjustHighlightedIndex(-1);
      } else if (model.highlightedIndex >= model.visibleChoices.length) {
        model.adjustHighlightedIndex(model.visibleChoices.length - 1);
      } else if( model.highlightedIndex === -1 ) {
        model.adjustHighlightedIndex(0);
      }
      model.visibleChoices = model.visibleChoices;
      model.updateDisplayText();
    },
  
    //updates the available choices from a lookup and calls visible choice update
    updateChoices: (items: T[]) => {
      model.lookedUpChoices = items;
      model.updateVisibleChoices();
      updateDisplay();
    },
  
    //calls parent notifier and visible choice update
    updateSelected: () => {
      onChange(model.selected);
      model.updateVisibleChoices();
    },
  
    //hides the list and clears the input choices
    hideList: () => {
      model.showChoices = false;
      updateDisplay();
    },
  
    //shows the list and sets the highlighted index to -1
    showList: () => {
      model.lookedUpChoices = undefined;
      model.inputText = "";
      model.updateVisibleChoices();
      model.showChoices = true;
      model.adjustHighlightedIndex(model.visibleChoices.length > 0 ? 0 : -1);
      model.showChoices = true;
      model.hideToolTip();
      updateDisplay();
    },
  
    //document click handler
    clickedAway: (mouseEvent: MouseEvent) => {
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
          model.hideList();
        }
      } catch (error) {
        console.log(
          `Failed to handle click away, reason: ${errorMessage(error)}`
        );
      }
    },
    
    //hanlder for clicking on the control
    textInputClicked: () => {
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
            model.updateSelected();
            updateDisplay();
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
        model.fetchChoices("");
      } else {
        model.updateVisibleChoices();
      }
      //show the item list
      model.showList();
    },
  
    //called when text entered into the input control
    textChanged: (event: ChangeEvent<HTMLInputElement>) => {
      //update text
      model.inputText = event.target.value;
      //if items lookup provided call it otherwise call updateVisiblechoices to filter items base on text
      if (props.typeAheadLookUp) {
        model.fetchChoices(event.target.value);
      } else {
        model.updateVisibleChoices();
      }
      updateDisplay();
    },
  
    //called when a choice is clicked.
    selectItem: (item: T) => {
      //if no maxium selections or number of selected items less than max, select the item
      if (
        !props.maximumSelections ||
        model.selected.length < props.maximumSelections
      ) {
        model.selected.push(item);
        model.updateSelected();
        //if a max of 1 item then selected only this item
      } else if (props.maximumSelections === 1) {
        model.selected[0] = item;
        model.updateSelected();
      }
      //if only 1 item allow and list a dropdown, close it
      if (
        (props.maximumSelections === 1 &&
        (props.minimumSelections === 1 || props.selectType === "dropdown")) || 
        props.hideListOnSelect
      ) {
        model.hideList();
      } else {
        updateDisplay();
      }
    },
  
    //called when a selected item is clicked
    deselectItem: (item: T) => {
      try {
        // if the selected items greater than minimum then deslect
        if (model.selected.length > (props.minimumSelections ?? 0)) {
          const idx = model.selected.indexOf(item);
          model.selected.splice(idx, 1);
          model.updateSelected();
          if( props.hideListOnSelect ) {
            model.hideList();
          } else {
            updateDisplay();
          }
        }
      } catch (error) {
        console.log(`Failed to de selecte item, reason: ${errorMessage(error)}`);
      }
    },
  
    //called when clear all selected items clicked.
    clearSelection: (event: ReactMouseEvent) => {
      if (props.disabled) {
        return;
      }
      model.selected = [];
      model.updateSelected();
      updateDisplay();
      event.stopPropagation();
    },
  
    //makes highlighted item visible
    makeItemVisible: (index: number) => {
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
  
    findNextEnabled: (index: number): number => {
      while (
        index < model.visibleChoices.length &&
        model.isDisabled(model.visibleChoices[index])
      )
        index++;
      return index;
    },
  
    findPrevEnabled: (index: number): number => {
      while (index > 0 && model.isDisabled(model.visibleChoices[index])) index--;
      return index;
    },
  
    //updates the highlighted item index
    adjustHighlightedIndex: (index: number) => {
      model.highlightedIndex = index;
      if (model.highlightedIndex !== -1) {
        model.makeItemVisible(model.highlightedIndex);
      }
    },
  
    adjustHighlightedIndexOnly: (index: number) => {
      model.highlightedIndex = index;
      if (model.highlightedIndex !== -1) {
        model.makeItemVisible(model.highlightedIndex);
      }
      updateDisplay();
    },

    //called when a key is pressed
    inputKeyPressed: (event: KeyboardEvent<HTMLDivElement>) => {
      try {
        switch (event.code) {
          case "ArrowDown":
            //if the highlited item less than max move down
            if (
              model.showChoices &&
              model.visibleChoices.length > 0
            ) {
              const index = (model.highlightedIndex === -1 || model.highlightedIndex >= model.visibleChoices.length - 1)
                ? model.findNextEnabled(0)
                : model.findNextEnabled(model.highlightedIndex + 1);
              model.adjustHighlightedIndexOnly(index);
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
                ? model.findPrevEnabled(model.visibleChoices.length - 1)
                : model.findPrevEnabled(model.highlightedIndex - 1);
              model.adjustHighlightedIndexOnly(index);
            }
            event.preventDefault();
            break;
          case "Home":
            //move to start
            if (model.showChoices && model.visibleChoices.length > 0) {
              const index = model.findNextEnabled(0);
              model. adjustHighlightedIndexOnly(index);
            }
            event.preventDefault();
            break;
          case "End":
            //move to end
            if (model.showChoices && model.visibleChoices.length > 0) {
              const index = model.findPrevEnabled(model.visibleChoices.length - 1);
              model.adjustHighlightedIndexOnly(index);
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
                model.selectItem(model.visibleChoices[model.highlightedIndex]);
                
              } else {
                model.deselectItem(model.visibleChoices[model.highlightedIndex]);
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
    
    pasteText: (event: ClipboardEvent) => {
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
                    ? model.getItemValueString(item).toLowerCase()
                    : model.getItemValueString(item)
                ) !== -1 && model.selected.indexOf(item) === -1
            )
          );
          if (
            props.maximumSelections &&
            model.selected.length >= props.maximumSelections
          ) {
            model.selected.splice(props.maximumSelections);
          }
          model.updateSelected();
          updateDisplay();
        } else if (props.itemSearch) {
          //otherwise if we have a func to call, call it
          props.itemSearch(items).then((foundItems) => {
            model.selected = model.selected.concat(
              foundItems.filter(
                (item) =>
                  !model.selected.find(
                    (sel) => model.getItemValue(sel) === model.getItemValue(item)
                  )
              )
            );
            if (
              props.maximumSelections &&
              model.selected.length >= props.maximumSelections
            ) {
              model.selected.splice(props.maximumSelections);
            }
            model.updateSelected();
            updateDisplay();
          });
        }
      } catch (error) {
        console.log(`Failed to paste items, reason: ${errorMessage(error)}`);
      }
    },
  
    checkToolTip: () => {
      if (!model.showChoices) {
        model.showToolTip = true;
        updateDisplay();
      }
    },
  
    hideToolTip: () => {
      model.showToolTip = false;
      updateDisplay();
    },

    getDisplayText: (selection: T[]): string => {
      try {
        return selection.length > 1
          ? `${selection.length} items`
          : selection.length === 1
          ? model.getItemText(selection[0])
          : "";
      } catch (error) {
        console.log(
          `Failed to fetch display text, reason: ${errorMessage(error)}`
        );
        return "";
      }
    },
  
    getCaption: (selection: T[]): string => {
      try {
        return selection.length > 1
          ? selection
              .slice(0, toolTipLimit())
              .map((item) => model.getItemText(item))
              .join(", ") +
              (selection.length > toolTipLimit()
                ? ` + ${selection.length - toolTipLimit()} more items`
                : "")
          : "";
      } catch (error) {
        console.log(
          `Failed to fetch caption text, reason: ${errorMessage(error)}`
        );
        return "";
      }
    },
  
    getMatchItem: (item: T): string => {
      return !props.caseSensitive ? model.getItemText(item).toLowerCase() : model.getItemText(item);
    },
  
  };

  model.updateDisplayText();

  return model;
}