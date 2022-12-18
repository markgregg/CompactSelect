import React, { FC, useState } from "react";
import CSS from "csstype";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import CompactSelect, { CompactSelectProps } from "compact-select";
import { bigString, bigTypesObjectString, choices, objectChoices, typedObjectChoices } from "./Choices";
import { TiDeleteOutline } from "react-icons/ti";
import { MdClear, MdDeleteForever, MdRemove, MdStarRate, MdOutlineCheckBox, MdRadioButtonChecked } from "react-icons/md";
import { GiCheckMark } from "react-icons/gi";
import { fetchItems, searchItems, slowFetchItems, searchObjects, slowFetchObjects, fetchObjects, fetchTyped, searchTyped } from "./utils";
import { SketchPicker } from "react-color";
import "./App.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "react-tabs/style/react-tabs.css";
import { IconType } from "react-icons/lib";
import ClipboardCopy from "./ClipboardCopy";

const clearIconMap = new Map<string,IconType>();
clearIconMap.set( "Circle Cross", TiDeleteOutline);
clearIconMap.set( "Cross", MdClear);
clearIconMap.set( "Trash Can", MdDeleteForever);
clearIconMap.set( "Minus", MdRemove);

const selectedIconMap = new Map<string,IconType>();
selectedIconMap.set( "Tick", GiCheckMark);
selectedIconMap.set( "Check Box", MdOutlineCheckBox);
selectedIconMap.set( "Radio", MdRadioButtonChecked);
selectedIconMap.set( "Star", MdStarRate);

const fontSizes = [
  "xx-large",
  "x-large",
  "larger",
  "large",
  "medium",
  "small",
  "smaller",
  "x-small",
  "xx-small"
];

const fontFamiles = [
  "Helvetica (sans-serif)",
  "Arial (sans-serif)",
  "Arial Black (sans-serif)",
  "Verdana (sans-serif)",
  "Tahoma (sans-serif)",
  "Trebuchet MS (sans-serif)",
  "Impact (sans-serif)",
  "Gill Sans (sans-serif)",
  "Times New Roman (serif)",
  "Georgia (serif)",
  "Palatino (serif)",
  "Baskerville (serif)",
  "Andalé Mono (monospace)",
  "Courier (monospace)",
  "Lucida (monospace)",
  "Monaco (monospace)",
  "Bradley Hand (cursive)",
  "Brush Script MT (cursive)",
  "Luminari (fantasy)",
  "Comic Sans MS (cursive)"
];

const fontWeights = [
  "normal",
  "bold",
  "bolder",
  "lighter",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900"
];

const borderStyle = [
  "none",
  "hidden",
  "dotted",
  "dashed",
  "solid",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset"
]

const FontSizeProperty = (name: string, value:  CSS.Property.FontSize | undefined, setValue: (value?: CSS.Property.FontSize) => void) => 
<div className="example">
  <p>{name}</p>
  <CompactSelect 
    selected={value as string}
    title={name}
    choices={fontSizes}
    maximumSelections={1}
    selectType="dropdown"
    onChange={ s => setValue(s as string) }
    width="200px"
  />
</div>

const FontFamilyProperty = (name: string, value: CSS.Property.FontFamily | undefined, setValue: (value?: CSS.Property.FontFamily) => void) => 
<div className="example">
  <p>{name}</p>
  <CompactSelect 
    selected={value}
    title={name}
    choices={fontFamiles}
    maximumSelections={1}
    selectType="dropdown"
    onChange={ s => setValue(s as string) }
    width="200px"
  />
</div>

const FontWeightProperty = (name: string, value: CSS.Property.FontWeight | undefined, setValue: (value?: CSS.Property.FontWeight) => void) => 
<div className="example">
  <p>{name}</p>
  <CompactSelect 
    title={name}
    selected={value}
    choices={fontWeights}
    maximumSelections={1}
    selectType="dropdown"
    onChange={ s => setValue(s as string) }
    width="200px"
  />
</div>

const FontStyleProperty = (name: string, value: CSS.Property.FontStyle | undefined, setValue: (value?: CSS.Property.FontStyle) => void) => 
<div className="example">
  <p>{name}</p>
  <CompactSelect 
    title={name}
    selected={value}
    choices={["normal","italic","oblique"]}
    maximumSelections={1}
    selectType="dropdown"
    onChange={ s => setValue(s as string) }
    width="200px"
  />
</div>

const BorderStyleProperty = (name: string, value: CSS.Property.BorderStyle | undefined, setValue: (value?: CSS.Property.BorderStyle) => void) => 
<div className="example">
  <p>{name}</p>
  <CompactSelect 
    title={name}
    selected={value}
    choices={borderStyle}
    maximumSelections={1}
    selectType="dropdown"
    onChange={ s => setValue(s as string) }
    width="200px"
  />
</div>


const ColorProperty = (name: string, value: CSS.Property.Color | undefined, setValue: (value?: CSS.Property.Color) => void) => {
  const [visible,setVisible] = useState<boolean>(false)

  const getColor = (): CSS.Properties => {
    return value ? {backgroundColor: value} : {};
  }

  return (
    <div className="example">
      <p>{name}</p>
      <button
        className="colorDot" 
        style={getColor()}
        onClick={() => setVisible(true)}
      />
      <Popup 
        open={visible}
        position="right center"
        onClose={() => setVisible(false)}
        contentStyle={{ padding: "0px", border: "none", width: "220px" }}
      >
        <div className="popup">
          <SketchPicker
            color={ value }
            onChangeComplete={e => setValue(e.hex) }
          />
        </div>
      </Popup>
  </div>)
}

const stringProperty = (name: string, value: string | undefined, setValue: (value?: string) => void) => 
<div className="example">
  <p>{name}</p>
  <input
    value={value ?? ''}
    onChange ={ e => setValue(e.target.value) }
  />
</div>

const listProperty = (name: string, value: string | undefined, setValue: (value?: string) => void, items: string[]) => 
<div className="example">
  <p>{name}</p>
  <CompactSelect 
    title={name}
    selected={value}
    choices={items}
    maximumSelections={1}
    selectType="dropdown"
    onChange={ s => setValue(s as string) }
    width="200px"
    height="20px"
  />
</div>

const App = () => {
  const [fontSize,setFontSize] = useState<CSS.Property.FontSize>();
  const [fontFamily,setFontFamily] = useState<CSS.Property.FontFamily>();
  const [fontWeight,setFontWeight] = useState<CSS.Property.FontWeight>();
  const [fontStyle,setFontStyle] = useState<CSS.Property.FontStyle>();
  const [color,setColor] = useState<CSS.Property.Color | undefined>("Black");
  const [backgroundColor,setBackgroundColor] = useState<CSS.Property.BackgroundColor | undefined>("white");
  const [backgroundImage,setBackgroundImage] = useState<CSS.Property.BackgroundImage>();
  const [disabledColor,setDisabledColor] = useState<CSS.Property.Color | undefined>("Darkgray");
  const [disableBackgroundColor,setDisableBackgroundColor] = useState<CSS.Property.BackgroundColor | undefined>("Gainsboro");
  const [disableBackgroundImage,setDisableBackgroundImage] = useState<CSS.Property.BackgroundImage>();
  const [borderColor,setBorderColor] = useState<CSS.Property.Color>();
  const [border,setBorder] = useState<string | undefined>("2px solid darkgray");
  const [borderRadius,setBorderRadius] = useState<string | undefined>("5px");
  const [borderStyle,setBorderStyle] = useState<CSS.Property.BorderStyle>();
  const [clearSelectionIcon,setClearSelectionIcon] = useState<string>();
  const [clearSelectionColor,setClearSelectionColor] = useState<CSS.Property.Color | undefined>("Black");
  const [clearSelectionDisabledColor,setClearSelectionDisabledColor] = useState<CSS.Property.Color | undefined>("Darkgray");
  const [clearSelectionHoverColor,setClearSelectionHoverColor] = useState<CSS.Property.Color | undefined>("Darkgray");
  const [clearSelectionSize,setClearSelectionSize] = useState<CSS.Property.FontSize | undefined>("large");
  const [titleColor,setTitleColor] = useState<CSS.Property.Color | undefined>("Darkgray");
  const [disabledTitleColor,setDisabledTitleColor] = useState<CSS.Property.Color | undefined>("lightgray");
  const [titleFontFamily,setTitleFontFamily] = useState<CSS.Property.FontFamily>();
  const [titleFontWeight,setTitleFontWeight] = useState<CSS.Property.FontWeight>();
  const [titleFontStyle,setTitleFontStyle] = useState<CSS.Property.FontStyle>();
  const [titleFontSize,setTitleFontSize] = useState<CSS.Property.FontSize | undefined>("small");
  const [choiceListBackgroundColor,setChoiceListBackgroundColor] = useState<CSS.Property.BackgroundColor>();
  const [choiceListBackgroundImage,setChoiceListBackgroundImage] = useState<CSS.Property.BackgroundImage>();
  const [choiceListBorder,setChoiceListBorder] = useState<string>();
  const [choiceListBorderColor,setChoiceListBorderColor] = useState<CSS.Property.Color>();
  const [choiceListBorderRadius,setChoiceListBorderRadius] = useState<string | undefined>("5px");
  const [choiceListBorderStyle,setChoiceListBorderStyle] = useState<CSS.Property.BorderStyle>();
  const [choiceColor,setChoiceColor] = useState<CSS.Property.Color | undefined>("Black");
  const [choiceFontFamily,setChoiceFontFamily] = useState<CSS.Property.FontFamily>();
  const [choiceFontWeight,setChoiceFontWeight] = useState<CSS.Property.FontWeight>();
  const [choiceFontStyle,setChoiceFontStyle] = useState<CSS.Property.FontStyle>();
  const [choiceFontSize,setChoiceFontSize] = useState<CSS.Property.FontSize>();
  const [choiceBackgroundColor,setChoiceBackgroundColor] = useState<CSS.Property.BackgroundColor>();
  const [choiceBackgroundImage,setChoiceBackgroundImage] = useState<CSS.Property.BackgroundImage>();
  const [choiceDisabledColor,setChoiceDisabledColor] = useState<CSS.Property.Color | undefined>("Darkgray");
  const [choiceSelectedBorder,setChoiceSelectedBorder] = useState<string | undefined>("2px solid lightgreen");
  const [choicedisabledBackgroundColor,setChoicedisabledBackgroundColor] = useState<CSS.Property.BackgroundColor | undefined>("Gainsboro");
  const [choiceDisabledBackgroundImage,setChoiceDisabledBackgroundImage] = useState<CSS.Property.BackgroundImage>();
  const [choiceSelectIndiacatorType,setChoiceSelectIndiacatorType] = useState<string>();
  const [choiceSelectedIcon,setChoiceSelectedIcon] = useState<string>();
  const [choiceSelectedColor,setChoiceSelectedColor] = useState<CSS.Property.Color | undefined>("green");
  const [choiceSelectedIconSize,setChoiceSelectedIconSize] = useState<CSS.Property.FontSize | undefined>("large");
  const [choiceSelectedBackgroundColor,setChoiceSelectedBackgroundColor] = useState<CSS.Property.BackgroundColor | undefined>( "green");
  const [choiceSelectedBackgroundImage,setChoiceSelectedBackgroundImage] = useState<CSS.Property.BackgroundImage>();
  const [choiceHoverBackgroundColor,setChoiceHoverBackgroundColor] = useState<CSS.Property.BackgroundColor | undefined>("lightgray");
  const [choiceHoverBackgroundImage,setChoiceHoverBackgroundImage] = useState<CSS.Property.BackgroundImage>();
  const [toolTipBackgroundColor,setToolTipBackgroundColor] = useState<CSS.Property.BackgroundColor>();
  const [toolTipBackgroundImage,setToolTipBackgroundImage] = useState<CSS.Property.BackgroundImage>();
  const [toolTipColor,setToolTipColor] = useState<CSS.Property.Color>();
  const [toolTipFontFamily,setToolTipFontFamily] = useState<CSS.Property.FontFamily>();
  const [toolTipFontWeight,setToolTipFontWeight] = useState<CSS.Property.FontWeight>();
  const [toolTipFontStyle,setToolTipFontStyle] = useState<CSS.Property.FontStyle>();
  const [toolTipFontSize,setToolTipFontSize] = useState<CSS.Property.FontSize>();
  const [toolTipBorder,setToolTipBorder] = useState<string>();
  const [toolTipBorderColor,setToolTipBorderColor] = useState<CSS.Property.Color>();
  const [toolTopBorderRadius,setToolTopBorderRadius] = useState<string>();
  const [toolTipBorderStyle,setToolTipBorderStyle] = useState<CSS.Property.BorderStyle>();
  const [toolTipPosition,setToolTipPosition] = useState<string>();
  const [disabledString, setDisabledString] = useState<boolean>(false);
  const [disabledObject, setDisabledObject] = useState<boolean>(false);
  const [theme,setTheme] = useState<CSS.Properties>({});

  const getIndiacatorType = (): "icon" | "color" | "border" => {
    if( choiceSelectIndiacatorType === "color" ) {
      return "color";
    }
    if( choiceSelectIndiacatorType === "border" ) {
      return "border";
    }
    return "icon";
  }

  const getToolTipPosition = (): "above" | "below" | "left" | "right" => {
    if( toolTipPosition === "above") {
      return "above";
    }
    if( toolTipPosition === "left") {
      return "left";
    }
    if( toolTipPosition === "right") {
      return "right";
    }
    return "below";
  }

  const compactSelect = <T extends object | string>(props: CompactSelectProps<T>) => 
    <CompactSelect 
      width="200px"
      fontSize={fontSize}
      fontFamily={fontFamily}
      fontWeight={fontWeight}
      fontStyle={fontStyle}
      color={color}
      backgroundColor={backgroundColor}
      backgroundImage={backgroundImage}
      disabledColor={disabledColor}
      disableBackgroundColor={disableBackgroundColor}
      disableBackgroundImage={disableBackgroundImage}
      borderColor={borderColor}
      border={border}
      borderRadius={borderRadius}
      borderStyle={borderStyle}
      clearSelectionIcon={clearSelectionIcon ? clearIconMap.get(clearSelectionIcon) : undefined}
      clearSelectionColor={clearSelectionColor}
      clearSelectionDisabledColor={clearSelectionDisabledColor}
      clearSelectionHoverColor={clearSelectionHoverColor}
      clearSelectionSize={clearSelectionSize}
      titleColor={titleColor}
      disabledTitleColor={disabledTitleColor}
      titleFontFamily={titleFontFamily}
      titleFontWeight={titleFontWeight}
      titleFontStyle={titleFontStyle}
      titleFontSize={titleFontSize}
      choiceListBackgroundColor={choiceListBackgroundColor}
      choiceListBackgroundImage={choiceListBackgroundImage}
      choiceListBorder={choiceListBorder}
      choiceListBorderColor={choiceListBorderColor}
      choiceListBorderRadius={choiceListBorderRadius}
      choiceListBorderStyle={choiceListBorderStyle}
      choiceColor={choiceColor}
      choiceFontFamily={choiceFontFamily}
      choiceFontWeight={choiceFontWeight}
      choiceFontStyle={choiceFontStyle}
      choiceFontSize={choiceFontSize}
      choiceBackgroundColor={choiceBackgroundColor}
      choiceBackgroundImage={choiceBackgroundImage}
      choiceDisabledColor={choiceDisabledColor}
      choicedisabledBackgroundColor={choicedisabledBackgroundColor}
      choiceDisabledBackgroundImage={choiceDisabledBackgroundImage}
      choiceSelectIndiacatorType={getIndiacatorType()}
      choiceSelectedIcon={choiceSelectedIcon ? selectedIconMap.get(choiceSelectedIcon) : undefined}
      choiceSelectedColor={choiceSelectedColor}
      choiceSelectedBorder={choiceSelectedBorder}
      choiceSelectedIconSize={choiceSelectedIconSize}
      choiceSelectedBackgroundColor={choiceSelectedBackgroundColor}
      choiceSelectedBackgroundImage={choiceSelectedBackgroundImage}
      choiceHoverBackgroundColor={choiceHoverBackgroundColor}
      choiceHoverBackgroundImage={choiceHoverBackgroundImage}
      toolTipBackgroundColor={toolTipBackgroundColor}
      toolTipBackgroundImage={toolTipBackgroundImage}
      toolTipColor={toolTipColor}
      toolTipFontFamily={toolTipFontFamily}
      toolTipFontWeight={toolTipFontWeight}
      toolTipFontStyle={toolTipFontStyle}
      toolTipFontSize={toolTipFontSize}
      toolTipBorder={toolTipBorder}
      toolTipBorderColor={toolTipBorderColor}
      toolTopBorderRadius={toolTopBorderRadius}
      toolTipBorderStyle={toolTipBorderStyle}
      toolTipPosition={getToolTipPosition()}
      {...props}
    />

  const darkStyle = () => {
    setTheme( {
      backgroundImage: "linear-gradient(to right, #050505, black)",
      color: "OldLace"
    });
    setBackgroundImage("linear-gradient(to right, white, Linen)");
    setBorder("2px solid MidnightBlue")
    setColor("black");
    setFontWeight("bold")
    setTitleColor("GhostWhite");
    setChoiceColor("black");
    setDisabledColor("SlateGray");
    setDisableBackgroundImage("linear-gradient(to right, Gainsboro, Gray)");
    setClearSelectionIcon("Cross");
    setClearSelectionColor("black");
    setClearSelectionHoverColor("lightblue");
    setDisabledTitleColor("SlateGray");
    setChoiceSelectedColor("Lime");
    setChoiceSelectedIcon("Star");
    setChoiceDisabledBackgroundImage("linear-gradient(to right, Gainsboro, Gray)");
    setChoiceHoverBackgroundImage("linear-gradient(to right, CornflowerBlue, Blue)");
    setToolTipColor("black");
    setToolTipBackgroundImage("linear-gradient(to right, Gainsboro, Gray)");
  }

  const lightStyle = () => {
    setTheme( {
      backgroundImage: "linear-gradient(to right, Linen, Bisque)",
      color: "Maroon"
    });
    setBackgroundImage("linear-gradient(to right, White, GhostWhite)");
    setBorder("2px solid BurlyWood")
    setColor("DarkGoldenRod");
    setTitleColor("BurlyWood");
    setChoiceColor("DarkGoldenRod");
    setDisabledColor("BurlyWood");
    setDisableBackgroundImage("linear-gradient(to right, WhiteSmoke, Gainsboro)");
    setClearSelectionIcon("Circle Cross");
    setClearSelectionColor("DarkGoldenRod");
    setClearSelectionHoverColor("BurlyWood");
    setDisabledTitleColor("SlateGray");
    setChoiceDisabledColor("BurlyWood");
    setChoiceSelectedColor("LightSeaGreen");
    setChoiceSelectedIcon("Tick");
    setChoiceDisabledBackgroundImage("linear-gradient(to right, WhiteSmoke, Gainsboro)");
    setChoiceHoverBackgroundImage("linear-gradient(to right, AntiqueWhite, BurlyWood)");
    setToolTipColor("DarkGoldenRod");
    setToolTipBackgroundImage("linear-gradient(to right, WhiteSmoke, Gainsboro)");
  }

  const blue = () => {
    setTheme( {
      backgroundImage: "linear-gradient(to right, Azure, LightBlue)",
      color: "MidnightBlue"
    });
    setBackgroundImage("linear-gradient(to right, White, GhostWhite)");
    setBorder("2px solid LightSkyBlue")
    setColor("MidnightBlue");
    setTitleColor("lightgray");
    setChoiceColor("MidnightBlue");
    setDisabledColor("LightSteelBlue");
    setDisableBackgroundImage("linear-gradient(to right, AliceBlue, LightSteelBlue)");
    setClearSelectionIcon("Circle Cross");
    setClearSelectionColor("MidnightBlue");
    setClearSelectionHoverColor("lightgray");
    setDisabledTitleColor("LightSteelBlue");
    setChoiceDisabledColor("Gray");
    setChoiceSelectedColor("LightSeaGreen");
    setChoiceSelectedIcon("Tick");
    setChoiceDisabledBackgroundImage("linear-gradient(to right, AliceBlue, LightSteelBlue)");
    setChoiceHoverBackgroundImage("linear-gradient(to right, LightCyan, LightSkyBlue)");
    setToolTipColor("MidnightBlue");
    setToolTipBackgroundImage("linear-gradient(to right, AliceBlue, LightSteelBlue)");
  }

  const green = () => {
    setTheme( {
      backgroundImage: "linear-gradient(to right, HoneyDew, Khaki)",
      color: "DarkGreen"
    });
    setBackgroundImage("linear-gradient(to right, White, GhostWhite)");
    setBorder("2px solid Silver")
    setColor("DarkGreen");
    setTitleColor("DarkSeaGreen");
    setChoiceColor("DarkGreen");
    setDisabledColor("DarkSeaGreen");
    setDisableBackgroundImage("linear-gradient(to right, HoneyDew, MediumAquaMarine)");
    setClearSelectionIcon("Circle Cross");
    setClearSelectionColor("DarkGreen");
    setClearSelectionHoverColor("DarkSeaGreen");
    setDisabledTitleColor("DarkSeaGreen");
    setChoiceDisabledColor("Gray");
    setChoiceSelectedColor("LightSeaGreen");
    setChoiceSelectedIcon("Tick");
    setChoiceDisabledBackgroundImage("linear-gradient(to right, HoneyDew, MediumAquaMarine)");
    setChoiceHoverBackgroundImage("linear-gradient(to right, HoneyDew, PaleGreen)");
    setToolTipBackgroundImage("linear-gradient(to right, WhiteSmoke, Gainsboro)");
  }
  return (
    <div className="styledExample" style={theme}>
      <div className="styles">
        <div className="buttons">
          <button className="dark" onClick={darkStyle}>Dark</button>
          <button className="light" onClick={lightStyle}>Light</button>
          <button className="veryBlue" onClick={blue}>V Blue</button>
          <button className="green" onClick={green}>Green</button>
        </div>
        <div className="properties">
          <Tabs>
            <TabList>
              <Tab>Single select</Tab>
              <Tab>Multi select</Tab>
              <Tab>Dropdown lists</Tab>
              <Tab>Switches</Tab>
              <Tab>Look ups</Tab>
              <Tab>Disabled</Tab>
              <Tab>Paste</Tab>
            </TabList>
            <TabPanel>
              <div className="examples">
                <div className="example">
                  <p>String Single or no selection</p>
                  {compactSelect( {title: "String Single or no selection", choices:choices, maximumSelections: 1} ) }
                </div>

                <div className="example">
                  <p>String Single selection</p>
                  {compactSelect( {title: "String Single selection", choices:choices, maximumSelections: 1, minimumSelections: 1} ) }
                </div>

                <div className="example">
                  <p>Object Single or no selection</p>
                  {compactSelect( {title: "Object Single or no selection", choices:objectChoices, maximumSelections: 1, itemValue: (item) => item.name, itemText: (item) => item.name} ) }
                </div>

                <div className="example">
                  <p>Object Single selection</p>
                  {compactSelect( {title: "Object Single selection", choices:objectChoices, maximumSelections: 1, minimumSelections: 1, itemValue: (item) => item.name, itemText: (item) => item.name} ) }
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="examples">
                <div className="example">
                  <p>Single Multi selection</p>
                  {compactSelect( {title: "String Multi selection", choices:choices } ) }
                </div>

                <div className="example">
                  <p>String 3 Item selection</p>
                  {compactSelect( {title: "String 3 Item selection", choices:choices, maximumSelections: 3} ) }
                </div>

                <div className="example">
                  <p>Object Multi selection</p>
                  {compactSelect( {title: "Object Multi selection", choices:objectChoices, itemValue: (item) => item.name, itemText: (item) => item.name } ) }
                </div>

                <div className="example">
                  <p>Object 3 Item selection</p>
                  {compactSelect( {title: "Object 3 Item selection", choices:objectChoices, maximumSelections: 3, itemValue: (item) => item.name, itemText: (item) => item.name} ) }
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="examples">
                <div className="example">
                  <p>String DropDown Single</p>
                  {compactSelect( {title: "String Single DropDown", choices:choices, maximumSelections: 1, selectType: "dropdown"} ) }
                </div>

                <div className="example">
                  <p>String DropDown Multi</p>
                  {compactSelect( {title: "String Multi DropDown", choices:choices, selectType: "dropdown"} ) }
                </div>  

                <div className="example">
                  <p>Object DropDown Single</p>
                  {compactSelect( {title: "Object Single DropDown", choices:objectChoices, maximumSelections: 1, selectType: "dropdown", itemValue: (item) => item.name, itemText: (item) => item.name} ) }
                </div>

                <div className="example">
                  <p>Object DropDown Multi</p>
                  {compactSelect( {title: "Object Multi DropDown", choices:objectChoices, selectType: "dropdown", itemValue: (item) => item.name, itemText: (item) => item.name} ) }
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="examples">
                <div className="example">
                  <p>String Switch</p>
                  {compactSelect( {title: "String Switch", choices:choices, maximumSelections: 1, selectType: "switch"} ) }
                </div>

                <div className="example">
                  <p>Object Switch</p>
                  {compactSelect( {title: "Object Switch", choices:objectChoices, maximumSelections: 1, selectType: "switch", itemValue: (item) => item.name, itemText: (item) => item.name} ) }
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="examples">
                <div className="example">
                  <p>String Look-up</p>
                  {compactSelect( {title: "String Look-up", typeAheadLookUp: fetchItems, itemSearch: searchItems} ) }
                </div>

                <div className="example">
                  <p>String Cache Items</p>
                  {compactSelect( {title: "String Cache Items", typeAheadLookUp: slowFetchItems, itemSearch: searchItems, cacheLookUp: true} ) }
                </div>

                <div className="example">
                  <p>String Cache Items Expire</p>
                  {compactSelect( {title: "String Cache Items Expire", typeAheadLookUp: slowFetchItems, itemSearch: searchItems, cacheLookUp: true, cacheTimeToLive: 10, cacheExpiryCheck: 10} ) }
                </div>

                <div className="example">
                  <p>Object Look-up</p>
                  {compactSelect( {title: "Object Look-up", typeAheadLookUp: fetchObjects, itemSearch: searchObjects, itemValue: (item) => item.name, itemText: (item) => item.name} ) }
                </div>

                <div className="example">
                  <p>Object Cache Items</p>
                  {compactSelect( {title: "Object Cache Items", typeAheadLookUp: slowFetchObjects, itemSearch: searchObjects, cacheLookUp: true, itemValue: (item) => item.name, itemText: (item) => item.name} ) }
                </div>

                <div className="example">
                  <p>Object Cache Items Expire</p>
                  {compactSelect( {title: "Object Cache Items Expire", typeAheadLookUp: slowFetchObjects, itemSearch: searchObjects, cacheLookUp: true, cacheTimeToLive: 10, cacheExpiryCheck: 10, itemValue: (item) => item.name, itemText: (item) => item.name} ) }
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="examples">
                <div className="example">
                  <p>String Disabled</p>
                  {compactSelect( {title: "String Disabled", choices: choices, disabled: disabledString} ) }
                  <input
                    type="checkbox"
                    id="disabled"
                    name="disabled"
                    checked={disabledString}
                    onChange={() => setDisabledString(!disabledString)}
                  />
                </div>

                <div className="example">
                  <p>Object Disabled</p>
                  {compactSelect( {title: "Object Disabled", choices: objectChoices, disabled: disabledObject, itemValue: (item) => item.name, itemText: (item) => item.name} ) }
                  <input
                    type="checkbox"
                    id="disabled"
                    name="disabled"
                    checked={disabledObject}
                    onChange={() => setDisabledObject(!disabledObject)}
                  />
                </div>


                <div className="example">
                  <p>Typed Disabled Items</p>
                  {compactSelect( {title: "Object Disabled", choices: typedObjectChoices} ) }
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="examples">
                <div className="example">
                  <p>Copy for string and object paste</p>
                  <ClipboardCopy text={bigString}/>
                </div>
                <div className="example">
                  <p>String Paste</p>
                  {compactSelect( {title: "String Paste", typeAheadLookUp: fetchItems, itemSearch: searchItems} ) }
                </div>

                <div className="example">
                  <p>Object Paste</p>
                  {compactSelect( {title: "Object Paste", typeAheadLookUp: fetchObjects, itemSearch: searchObjects, itemValue: (item) => item.name, itemText: (item) => item.name} ) }
                </div>

                <div className="example">
                  <p>Copy for typed paste</p>
                  <ClipboardCopy text={bigTypesObjectString}/>
                </div>
                <div className="example">
                  <p>Typed Paste</p>
                  {compactSelect( {title: "Typed Paste", typeAheadLookUp: fetchTyped, itemSearch: searchTyped }) }
                </div>
                
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
      <div className="properties">
        <Tabs>
          <TabList>
            <Tab>Input Properties</Tab>
            <Tab>Clear Selection Properties</Tab>
            <Tab>Title Properties</Tab>
            <Tab>List Properties</Tab>
            <Tab>Choice Properties</Tab>
            <Tab>Selected Choice Properties</Tab>
            <Tab>Tooltip Properties</Tab>
          </TabList>
          <TabPanel>
            <div className="propertyList">
              {FontSizeProperty("FontSize", fontSize, setFontSize)}
              {FontFamilyProperty("FontFamily", fontFamily, setFontFamily)}
              {FontWeightProperty("FontWeight", fontWeight, setFontWeight)}
              {FontStyleProperty("FontSize", fontStyle, setFontStyle)}
              {ColorProperty("Text color", color, setColor)}
              {ColorProperty("BackgroundColor", backgroundColor, setBackgroundColor)}
              {stringProperty("BackgroundImage", backgroundImage, setBackgroundImage)}
              {ColorProperty("DisabledFontColor", disabledColor, setDisabledColor)}
              {ColorProperty("DisableBackgroundColor", disableBackgroundColor, setDisableBackgroundColor)}
              {stringProperty("DisableBackgroundImage", disableBackgroundImage, setDisableBackgroundImage)}
              {stringProperty("Border", border, setBorder)}
              {ColorProperty("BorderColor", borderColor, setBorderColor)}
              {stringProperty("BorderRadius", borderRadius, setBorderRadius)}
              {BorderStyleProperty("BorderStyle", borderStyle, setBorderStyle)}
            </div>
          </TabPanel>
          
          <TabPanel>
            <div className="propertyList">
              {listProperty("ClearSelectionIcon", clearSelectionIcon, setClearSelectionIcon, ["Circle Cross","Cross", "Trash Can","Minus"])}
              {ColorProperty("ClearSelectionColor", clearSelectionColor, setClearSelectionColor)}
              {ColorProperty("ClearSelectionDisabledColor", clearSelectionDisabledColor, setClearSelectionDisabledColor)}
              {ColorProperty("ClearSelectionHoverColor", clearSelectionHoverColor, setClearSelectionHoverColor)}
              {FontSizeProperty("ClearSelectionSize", clearSelectionSize, setClearSelectionSize)}
            </div>
          </TabPanel>
          <TabPanel>
            <div className="propertyList">
              {ColorProperty("TitleColor", titleColor, setTitleColor)}
              {ColorProperty("DisabledtitleColor", disabledTitleColor, setDisabledTitleColor)}
              {FontSizeProperty("TitleFontSize", titleFontSize, setTitleFontSize)}
              {FontFamilyProperty("TitleFontFamily", titleFontFamily, setTitleFontFamily)}
              {FontWeightProperty("TitleFontWeight", titleFontWeight, setTitleFontWeight)}
              {FontStyleProperty("TitleFontStyle", titleFontStyle, setTitleFontStyle)}
            </div>
          </TabPanel>
          <TabPanel>
            <div className="propertyList">
              {ColorProperty("ChoiceListBackgroundColor", choiceListBackgroundColor, setChoiceListBackgroundColor)}
              {stringProperty("ChoiceListBackgroundImage", choiceListBackgroundImage, setChoiceListBackgroundImage)}
              {stringProperty("ChoiceListBorder", choiceListBorder, setChoiceListBorder)}
              {ColorProperty("ChoiceListBorderColor", choiceListBorderColor, setChoiceListBorderColor)}
              {stringProperty("ChoiceListBorderRadius", choiceListBorderRadius, setChoiceListBorderRadius)}
              {BorderStyleProperty("ChoiceListBorderStyle", choiceListBorderStyle, setChoiceListBorderStyle)}
            </div>
          </TabPanel>
          <TabPanel>
            <div className="propertyList">
              {ColorProperty("ChoiceColor", choiceColor, setChoiceColor)}
              {FontSizeProperty("TitleFontSize", choiceFontSize, setChoiceFontSize)}
              {FontFamilyProperty("ChoiceFontFamily", choiceFontFamily, setChoiceFontFamily)}
              {FontWeightProperty("ChoiceFontWeight", choiceFontWeight, setChoiceFontWeight)}
              {FontStyleProperty("ChoiceFontStyle", choiceFontStyle, setChoiceFontStyle)}
              {ColorProperty("ChoiceBackgroundColor", choiceBackgroundColor, setChoiceBackgroundColor)}
              {stringProperty("ChoiceBackgroundImage", choiceBackgroundImage, setChoiceBackgroundImage)}
              {ColorProperty("ChoiceDisabledColor", choiceDisabledColor, setChoiceDisabledColor)}
              {ColorProperty("ChoicedisabledBackgroundColor", choicedisabledBackgroundColor, setChoicedisabledBackgroundColor)}
              {stringProperty("ChoiceDisabledBackgroundImage", choiceDisabledBackgroundImage, setChoiceDisabledBackgroundImage)}
              {ColorProperty("ChoiceHoverBackgroundColor", choiceHoverBackgroundColor, setChoiceHoverBackgroundColor)}
              {stringProperty("ChoiceHoverBackgroundImage", choiceHoverBackgroundImage, setChoiceHoverBackgroundImage)}
            </div>
          </TabPanel>
          <TabPanel>
            <div className="propertyList">
              {listProperty("ChoiceSelectIndiacatorType", choiceSelectIndiacatorType, setChoiceSelectIndiacatorType, ["icon", "color", "border"])}
              {listProperty("ClearSelectionIcon", choiceSelectedIcon, setChoiceSelectedIcon, ["Tick", "Check Box", "Radio", "Star"])}
              {stringProperty("ChoiceSelectedBorder", choiceSelectedBorder, setChoiceSelectedBorder)}
              {FontSizeProperty("ChoiceSelectedIconSize", choiceSelectedIconSize, setChoiceSelectedIconSize)}
              {ColorProperty("ChoiceSelectedColor", choiceSelectedColor, setChoiceSelectedColor)}
              {ColorProperty("ChoiceSelectedBackgroundColor", choiceSelectedBackgroundColor, setChoiceSelectedBackgroundColor)}
              {stringProperty("ChoiceSelectedBackgroundImage", choiceSelectedBackgroundImage, setChoiceSelectedBackgroundImage)}
            </div>
          </TabPanel>
          <TabPanel>
            <div className="propertyList">
              {ColorProperty("ToolTipBackgroundColor", toolTipBackgroundColor, setToolTipBackgroundColor)}
              {stringProperty("ToolTipBackgroundImage", toolTipBackgroundImage, setToolTipBackgroundImage)}
              {ColorProperty("ToolTipColor", toolTipColor, setToolTipColor)}
              {FontSizeProperty("ToolTipFontSize", toolTipFontSize, setToolTipFontSize)}
              {FontFamilyProperty("ToolTipFontWeight", toolTipFontFamily, setToolTipFontFamily)}
              {FontWeightProperty("ToolTipFontWeight", toolTipFontWeight, setToolTipFontWeight)}
              {FontStyleProperty("ToolTipFontStyle", toolTipFontStyle, setToolTipFontStyle)}
              {stringProperty("ToolTipBorder", toolTipBorder, setToolTipBorder)}
              {ColorProperty("ToolTipBorderColor", toolTipBorderColor, setToolTipBorderColor)}
              {stringProperty("ToolTopBorderRadius", toolTopBorderRadius, setToolTopBorderRadius)}
              {BorderStyleProperty("ToolTipBorderStyle", toolTipBorderStyle, setToolTipBorderStyle)}
              {listProperty("ToolTipPosition", toolTipPosition, setToolTipPosition, ["above", "below", "left", "right"])}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default App;
