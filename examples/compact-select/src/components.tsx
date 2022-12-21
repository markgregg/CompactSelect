import React, { FC, useState } from "react";
import CSS from "csstype";
import CompactSelect from "compact-select";
import { borderStyles, fontFamiles, fontSizes, fontWeights } from "./data/data";
import { SketchPicker } from "react-color";
import Popup from "reactjs-popup";
import "./App.css";

interface ClipboardCopyProps {
  text: string;
}

export const ClipboardCopy: FC<ClipboardCopyProps> = ({ text }) => {
  const [copied, setCopied] = useState("Click to copy");
  return (
    <div
      className="clipboardCopy"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied("Copied");
      }}
    >
      {copied}
    </div>
  );
};

export const FontSizeProperty = (name: string, value:  CSS.Property.FontSize | undefined, setValue: (value?: CSS.Property.FontSize) => void) => 
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

export const FontFamilyProperty = (name: string, value: CSS.Property.FontFamily | undefined, setValue: (value?: CSS.Property.FontFamily) => void) => 
<div className="example">
  <p>{name}</p>
  <CompactSelect 
    selected={value}
    title={name}
    choices={fontFamiles}
    maximumSelections={1}
    selectType="dropdown"
    onChange={ s => {
      console.log("here")
      console.log(s);
      setValue(s as string) 
    }}
    width="200px"
  />
</div>

export const FontWeightProperty = (name: string, value: CSS.Property.FontWeight | undefined, setValue: (value?: CSS.Property.FontWeight) => void) => 
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

export const FontStyleProperty = (name: string, value: CSS.Property.FontStyle | undefined, setValue: (value?: CSS.Property.FontStyle) => void) => 
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

export const BorderStyleProperty = (name: string, value: CSS.Property.BorderStyle | undefined, setValue: (value?: CSS.Property.BorderStyle) => void) => 
<div className="example">
  <p>{name}</p>
  <CompactSelect 
    title={name}
    selected={value}
    choices={borderStyles}
    maximumSelections={1}
    selectType="dropdown"
    onChange={ s => setValue(s as string) }
    width="200px"
  />
</div>

export const ColorProperty = (name: string, value: CSS.Property.Color | undefined, setValue: (value?: CSS.Property.Color) => void) => {
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

export const StringProperty = (name: string, value: string | undefined, setValue: (value?: string) => void) => 
<div className="example">
  <p>{name}</p>
  <input
    value={value ?? ''}
    onChange ={ e => setValue(e.target.value) }
  />
</div>

export const ListProperty = (name: string, value: string | undefined, setValue: (value?: string) => void, items: string[]) => 
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