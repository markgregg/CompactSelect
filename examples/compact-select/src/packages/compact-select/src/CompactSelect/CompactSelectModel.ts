import {
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
  token: string;
  inputText: string;
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
  props: SelectProps<T>;
  refresh?: () => void;

  updateProps: (props: SelectProps<T>) => void;
  updateDisplay: () => void;
  getItemText: (item: T) => string;
  getItemValue: (item: T) => any;
  getItemValueString: (item: T) => string;
  isDisabled: (item: T) => boolean;
  toolTipLimit: () => number;
  onChange: (items: T[]) => void;
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
  textInputClicked: (inputRef: RefObject<HTMLInputElement>) => void;
  textChanged: (event: ChangeEvent<HTMLInputElement>) => void;
  selectItem: (item: T) => void;
  deselectItem: (item: T) => void;
  makeItemVisible: (index: number) => void;
  findNextEnabled: (index: number,) => number;
  findPrevEnabled: (index: number,) => number;
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

const defaultToolTipLimit = 20;

export const createCompactSelectModel = <T extends Choice | object | string>(initialProps: SelectProps<T>) : CompactSelectModel<T> => {

  const getSelection = (props: SelectProps<T>): T[] => {
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
  };


  const model: CompactSelectModel<T> = {
    token: "",
    selected: getSelection(initialProps),
    inputText: "",
    showChoices: false,
    visibleChoices: [],
    lookedUpChoices: [],
    highlightedIndex: -1,
    showToolTip: false,
    displayText: "",
    caption: "",
    cache: initialProps.cacheLookUp
      ? createCache<T>(
        initialProps.title,
        initialProps.cacheTimeToLive,
        initialProps.cacheExpiryCheck
        )
      : undefined,
    selectId: generateGuid(),
    props: initialProps,
    
    updateProps: (props: SelectProps<T>) => {
      if( props.selected !== model.props.selected) {
        model.selected = getSelection(props);
        model.updateVisibleChoices();
      }
      if( props.choices !== model.props.choices ) {
        model.updateVisibleChoices();
      }
      model.props = props;
    },

    updateDisplay: () => {
      if( model.refresh ) {
        model.refresh();
      }
    },

    getItemText: (item: T): string => {
      try {
        return (
          (item as Choice).text ??
          (model.props.itemText ? model.props.itemText(item) : (item as string))
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
          (model.props.itemValue ? model.props.itemValue(item) : item)
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
          (model.props.itemValue ? model.props.itemValue(item) : item);
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
          (model.props.itemDisabled ? model.props.itemDisabled(item) : false)
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

    toolTipLimit: (): number => {
      return model.props.toolTipValueLimit ?? defaultToolTipLimit;
    },
    
    onChange: (items: T[]) => {
      if (model.props.onChange) {
        model.props.onChange([...items]);
      }
    },

    fetchChoices: (text: string) => {
      if (model.props.typeAheadLookUp && (text !== "" || !model.props.noEmptyStringLookUp)) {
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
        model.props.typeAheadLookUp(text, model.selected).then((items) => {
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
        !model.props.caseSensitive ? model.inputText.toLowerCase() : model.inputText
      );
    },

    //determine visible choices based on available choices and what is selected
    getVisibleChoices: (): T[] => {
      try {
        //if not lookup choices availale and no choices supplied show selected items
        if (!model.lookedUpChoices && !model.props.choices) {
          return model.selected;
        }

        //filter out selected items and items that do not contain text input
        return model.selected
          .filter((item) => !model.inputText || model.shouldFilter(item))
          .concat(
            (model.lookedUpChoices ?? model.props.choices ?? []).filter(
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
      model.updateDisplayText();
    },

    //updates the available choices from a lookup and calls visible choice update
    updateChoices: (items: T[]) => {
      model.lookedUpChoices = items;
      model.updateVisibleChoices();
      model.updateDisplay();
    },

    //calls parent notifier and visible choice update
    updateSelected: () => {
      model.onChange(model.selected);
      model.updateVisibleChoices();
    },

    //hides the list and clears the input choices
    hideList: () => {
      model.showChoices = false;
      model.updateDisplay();
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
      model.updateDisplay();
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
    textInputClicked: (inputRef: RefObject<HTMLInputElement>) => {
      if (model.props.disabled) {
        return;
      }
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
      //if list already shown do nothing.
      if (model.showChoices) {
        return;
      }
      //if behaving as a switch move to the next item in the list
      if (model.props.selectType === "switch") {
        try {
          if (model.props.choices) {
            var index =
              model.selected.length > 0
                ? model.props.choices.indexOf(model.selected[0]) + 1
                : 0;
            if (index + 1 > model.props.choices.length) {
              index = 0;
            }
            model.selected = [model.props.choices[index]];
            model.updateSelected();
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
      if (model.props.typeAheadLookUp) {
        model.fetchChoices("");
      } else {
        model.updateVisibleChoices();
      }
      //show the item list
      model.showList();
    },

    //called when text entered into the input control
    textChanged: (
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      //update text
      model.inputText = event.target.value;
      //if items lookup provided call it otherwise call updateVisiblechoices to filter items base on text
      if (model.props.typeAheadLookUp) {
        model.fetchChoices(event.target.value);
      } else {
        model.updateVisibleChoices();
      }
      model.updateDisplay();
    },

    //called when a choice is clicked.
    selectItem: (item: T) => {
      //if no maxium selections or number of selected items less than max, select the item
      if (
        !model.props.maximumSelections ||
        model.selected.length < model.props.maximumSelections
      ) {
        model.selected.push(item);
        model.updateSelected();
        //if a max of 1 item then selected only this item
      } else if (model.props.maximumSelections === 1) {
        model.selected[0] = item;
        model.updateSelected();
      }
      //if only 1 item allow and list a dropdown, close it
      if (
        (model.props.maximumSelections === 1 &&
        (model.props.minimumSelections === 1 || model.props.selectType === "dropdown")) || 
        model.props.hideListOnSelect
      ) {
        model.hideList();
      } else {
        model.updateDisplay();
      }
    },

    //called when a selected item is clicked
    deselectItem: (item: T) => {
      try {
        // if the selected items greater than minimum then deslect
        if (model.selected.length > (model.props.minimumSelections ?? 0)) {
          const idx = model.selected.indexOf(item);
          model.selected.splice(idx, 1);
          model.updateSelected();
          if( model.props.hideListOnSelect ) {
            model.hideList();
          } else {
            model.updateDisplay();
          }
        }
      } catch (error) {
        console.log(`Failed to de selecte item, reason: ${errorMessage(error)}`);
      }
    },

    //called when clear all selected items clicked.
    clearSelection: (event: ReactMouseEvent) => {
      if (model.props.disabled) {
        return;
      }
      model.selected = [];
      model.updateDisplay();
      model.updateSelected();
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

    findNextEnabled: (index: number,): number => {
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
      model.updateDisplay();
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
              model.adjustHighlightedIndexOnly(index);
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
              if( model.props.clearInputOnSelect ) {
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
        if (model.props.choices && model.props.choices.length > 0) {
          //if we have choices then search choices
          const searchItems = !model.props.caseSensitive
            ? items.map((s) => s.toLowerCase())
            : items;
          model.selected = model.selected.concat(
            model.props.choices.filter(
              (item) =>
                searchItems.indexOf(
                  !model.props.caseSensitive
                    ? model.getItemValueString(item).toLowerCase()
                    : model.getItemValueString(item)
                ) !== -1 && model.selected.indexOf(item) === -1
            )
          );
          if (
            model.props.maximumSelections &&
            model.selected.length >= model.props.maximumSelections
          ) {
            model.selected.splice(model.props.maximumSelections);
          }
          model.updateSelected();
          model.updateDisplay();
        } else if (model.props.itemSearch) {
          //otherwise if we have a func to call, call it
          model.props.itemSearch(items).then((foundItems) => {
            model.selected = model.selected.concat(
              foundItems.filter(
                (item) =>
                  !model.selected.find(
                    (sel) => model.getItemValue(sel) === model.getItemValue(item)
                  )
              )
            );
            if (
              model.props.maximumSelections &&
              model.selected.length >= model.props.maximumSelections
            ) {
              model.selected.splice(model.props.maximumSelections);
            }
            model.updateSelected();
            model.updateDisplay();
          });
        }
      } catch (error) {
        console.log(`Failed to paste items, reason: ${errorMessage(error)}`);
      }
    },

    checkToolTip: () => {
      if (!model.showChoices) {
        model.showToolTip = true;
        model.updateDisplay();
      }
    },

    hideToolTip: () => {
      model.showToolTip = false;
      model.updateDisplay();
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
              .slice(0, model.toolTipLimit())
              .map((item) => model.getItemText(item))
              .join(", ") +
              (selection.length > model.toolTipLimit()
                ? ` + ${selection.length - model.toolTipLimit()} more items`
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
      return !model.props.caseSensitive ? model.getItemText(item).toLowerCase() :model.getItemText(item);
    }
  }

  model.updateDisplayText();
  return model;
 };
