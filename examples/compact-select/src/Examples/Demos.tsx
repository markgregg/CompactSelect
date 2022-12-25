import { useState } from "react";
import CSS from "csstype";
import CompactSelect, { ChoiceProps, ChoiceStyle, CompactSelectProps, DisplayProps, DisplayStyle } from "compact-select";
import { CodeBlock, googlecode } from "react-code-blocks";
import { ClipboardCopy } from "../components";
import { AiOutlineEdit, AiOutlineCopy, AiOutlineCode } from "react-icons/ai";
import { bigString, bigTypesObjectString, choices, colorChoices, ColorItem, objectChoices, typedObjectChoices } from "../data/data";
import { Theme } from "../interfaces/theme";
import { fetchItems, fetchTyped, searchItems, searchTyped, slowFetchItems, slowFetchObjects } from "../utils";
import "./Examples.css";

const itemDisplay = (
  text: string,
  color: CSS.Property.Color,
  fontColor: CSS.Property.Color,
  highlight: boolean
): JSX.Element => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      columnGap: "10px"
    }}
  >
    {text !== "" && (
      <div
        style={{
          backgroundColor: color,
          height: "10px",
          width: "10px",
          borderRadius: "15px"
        }}
      />
    )}
    <p style={{
        marginBlockStart: "0px",
        marginBlockEnd: "0px",
        color: highlight ? "lightgreen" : fontColor,
        fontWeight: highlight ? "bold" : "normal"
      }}
    >
      {text}
    </p>
  </div>
);

const choice = <T extends object | string>(props: ChoiceProps<T> & ChoiceStyle) => {
  return (
    <div 
      key={(props.item as ColorItem).value}
      onClick={() => props.onSelected(props.item)}
    >
      { itemDisplay((props.item as ColorItem).text, (props.item as ColorItem).color, props.choiceColor ?? 'black', props.choiceSelected) }
    </div>
  )
};

const itemText = <T extends object | string>(selected: T[]): string =>
  selected.length === 0
    ? ""
    : (selected[0] as ColorItem).text;

const itemColor = <T extends object | string>(selected: T[]): string =>
  selected.length === 0 
    ? "black" 
    : (selected[0] as ColorItem).color;

const display = <T extends object | string>(props: DisplayStyle & DisplayProps<T>) => (
  <div>
    {itemDisplay(itemText(props.selected), itemColor(props.selected), props.color  ?? 'black', false)}
  </div>
);

interface DemoItemProperties<T extends object | string> {
  title: string, 
  description: string, 
  props: CompactSelectProps<T>, 
  theme: Theme, 
  code?: string,
  sandbox?: string,
}
const DemoItem = <T extends object | string>(props: DemoItemProperties<T>) => {
  const [showCode,setShowCode] = useState<string>("");
  const [showCopied,setShowCopied] = useState<boolean>(false);

  return(
    <div 
      className="demo"
      key={"demo" + props.title}
    >
      <h2 className="demo-title">{props.title}</h2>
      <div className="demo-description">
          <p>{props.description}</p>
        </div>
      <div className="demo-item">
        <CompactSelect
          key={props.title}
          backgroundColor={props.theme.color3}
          color={props.theme.selectFont}
          choiceHoverBackgroundColor={props.theme.color5}
          disableBackgroundColor={props.theme.color4}
          toolTipBackgroundColor={props.theme.color4}
          border={`${props.theme.color2} solid 2px`}
          {...props.props}
        />
        <div className="icons">
          <AiOutlineCode
            onClick={() => {
              setShowCode(showCode === props.title ? "" : props.title)
            }}
          />
          <div className="copy-wrapper">
            <AiOutlineCopy
              onClick={() => {
                navigator.clipboard.writeText(props.code ?? "");
                setShowCopied(true);
                setTimeout(() => setShowCopied(false), 2000);
              }}
            />
            {
              showCopied && <p className="copied-text">Copied</p>
            }
          </div>
          <AiOutlineEdit
            onClick={() => window.open(props.sandbox, '_blank')}
          />
        </div>
      </div>
      {
        showCode === props.title &&  
        <div className="code">
          <CodeBlock
            width="100%"
            text={props.code}
            language="typescript"
            showLineNumbers={false}
            theme={googlecode}
          />
        </div>
      }
    </div>
  )
}

export interface Category {
  name: string;
  demo: (theme: Theme) => JSX.Element;
}

export const categories: Category[] = [
  { name: "Binding", 
    demo: (theme: Theme) =>
    <div className="demo">
      <DemoItem
          title="String binding"
          description="The simpliest way to use a compact select - set the choices property to an array of strings"
          props={{
            width: "200px",
            title: "Bind String", 
            choices:choices
          }} 
          theme={theme}
          code={
`import CompactSelect from "compact-select";
import { choices } from "./data";
import "./styles.css";

export default function App() {
  return (
    <div className="Space">
      <CompactSelect
        title="test"
        choices={choices}
      />
    </div>
  );
}`
        }
        sandbox="https://codesandbox.io/s/string-binding-9jlrb0"
      />
      <DemoItem
          title="Object binding"
          description="You can bind to an array of objects by passing them to the choices property, and set the item, text and disbaled (if required) getters."
          props={{
            width: "200px",
            title: "One/Zero value",
            choices:objectChoices, 
            itemValue: (item) => item.name, 
            itemText: (item) => item.name,
            itemDisabled: (item) => item.disabled
          }} 
          theme={theme}
          code={
`import CompactSelect from "compact-select";
import { objectChoices } from "./data";
import "./styles.css";

export default function App() {
  return (
    <div className="Space">
      <CompactSelect
        title="test"
        choices={objectChoices}
        itemValue={(item) => item.name} 
        itemText={(item) => item.name}
        itemDisabled={(item) => item.disabled}
      />
    </div>
  );
}`
        }
        sandbox="https://codesandbox.io/s/object-binding-forked-d54u70"
      />
    <DemoItem
      title="Typed object binding"
      description="Typed object binding is much like using an array of JSON objects, except the objects must implement the choice interface."
      props={{
        width: "200px",
        title: "One/Zero value",
        choices:typedObjectChoices
      }} 
      theme={theme}
      code={
`import CompactSelect from "compact-select";
import { typedObjectChoices } from "./data";
import "./styles.css";

export default function App() {
return (
<div className="Space">
  <CompactSelect
    title="test"
    choices={typedObjectChoices}
  />
</div>
);
}`
    }
    sandbox="https://codesandbox.io/s/typed-binding-cdhsme"
  />
    </div>
  },
  { name: "Single select", 
    demo: (theme: Theme) =>
    <div className="demo">
      <DemoItem
          title="Single string"
          description="Demos a compact select where the user can select one string."
          props={{
            width: "200px",
            title: "One String", 
            choices:choices, 
            maximumSelections: 1, 
            minimumSelections: 1
          }} 
          theme={theme}
          code={
`import CompactSelect from "compact-select";
import { choices } from "./data";
import "./styles.css";

export default function App() {
  return (
    <div className="Space">
      <CompactSelect
        title="test"
        choices={choices},
        maximumSelections={1} 
        minimumSelections={1}
      />
    </div>
  );
}`
        }
        sandbox="https://codesandbox.io/s/simple-single-string-compact-select-j6hpei"
      />
      <DemoItem
          title="Single or no value"
          description="Demos a compact select where the user can select one or no values."
          props={{
            width: "200px",
            title: "One/Zero value",
            choices:objectChoices, 
            maximumSelections: 1, 
            itemValue: (item) => item.name, 
            itemText: (item) => item.name
          }} 
          theme={theme}
          code={
`import CompactSelect from "compact-select";
import { objectChoices } from "./data";
import "./styles.css";

export default function App() {
  return (
    <div className="Space">
      <CompactSelect
        title="test"
        choices={objectChoices}
        maximumSelections={1}
        itemValue={(item) => item.name} 
        itemText={(item) => item.name}
      />
    </div>
  );
}`
        }
        sandbox="https://codesandbox.io/s/simple-single-no-value-compact-select-oskfme"
      />
    </div>
  },
  { 
    name: "Multi select",
    demo: (theme: Theme) =>
    <div className="demo">
      <DemoItem
          title="Multi string"
          description="A multi string selection control. No or many strings can be selected."
          props={{
            width: "200px",
            title: "Multi string", 
            choices:choices
          }} 
          theme={theme}
          code={
`import CompactSelect from "compact-select";
import { choices } from "./data";
import "./styles.css";

export default function App() {
  return (
    <div className="Space">
      <CompactSelect
        title="test"
        choices={choices}
      />
    </div>
  );
}`
        }
        sandbox="https://codesandbox.io/s/multi-string-compact-select-2wbrc2"
      />
      <DemoItem
          title="Fixed multi value"
          description="A three value selection control. Up to three values can be selected"
          props={{
            width: "200px",
            title: "Three objects", 
            choices:objectChoices, 
            maximumSelections: 3, 
            itemValue: (item) => item.name, 
            itemText: (item) => item.name
          }} 
          theme={theme}
          code={
`import CompactSelect from "compact-select";
import { objectChoices } from "./data";
import "./styles.css";

export default function App() {
  return (
    <div className="Space">
      <CompactSelect
        title="test"
        choices={objectChoices}
        maximumSelections={3}
        itemValue={(item) => item.name} 
        itemText={(item) => item.name}
      />
    </div>
  );
}`
        }
        sandbox="https://codesandbox.io/s/fixed-value-compact-select-vc6y74"
      />
    </div>
  },
  { 
    name: "Dropdown lists",
    demo: (theme: Theme) =>
    <div className="demo">
      <DemoItem
        title="Single string dropdown"
        description="A single string dropdown selection control. A single string can be selected."
        props={{
          width: "150px",
          title: "String dropdown",
          choices:choices, 
          maximumSelections: 1, 
          selectType: "dropdown"
        }} 
        theme={theme}
        code={
`import CompactSelect from "compact-select";
import { choices } from "./data";
import "./styles.css";

export default function App() {
  return (
    <div className="Space">
      <CompactSelect
        title="test"
        choices={choices}
        maximumSelections={1}
        selectType="dropdown"
      />
    </div>
  );
}`
      }
      sandbox="https://codesandbox.io/s/single-string-dropdown-er55j4"
      />
      <DemoItem
          title="Multi value dropdown"
          description="A multi value dropdown selection control. Multiple values can be selected."
          props={{
            width: "150px",
            title: "Values dropdown", 
            choices:objectChoices, 
            selectType: "dropdown", 
            itemValue: (item) => item.name, 
            itemText: (item) => item.name
          }} 
          theme={theme}
          code={
`import CompactSelect from "compact-select";
import { objectChoices } from "./data";
import "./styles.css";

export default function App() {
  return (
    <div className="Space">
      <CompactSelect
        title="test"
        choices={objectChoices}
        selectType="dropdown" 
        itemValue={(item) => item.name} 
        itemText={(item) => item.name}
      />
    </div>
  );
}`
        }
        sandbox="https://codesandbox.io/s/multi-value-dropdown-z5sbbo"
      />
    </div>
  },
  { 
    name: "Switches",
    demo: (theme: Theme) =>
    <div className="demo">
      <DemoItem
        title="String switch"
        description="A string switch control. Alternates between the available values."
        props={{
          hideTitle: true,
          title: "String switch", 
          choices:choices,
          selectType: "switch",
          minimumSelections: 1,
        }} 
        theme={theme}
        code={
`import CompactSelect from "compact-select";
import { choices } from "./data";
import "./styles.css";

export default function App() {
  return (
    <div className="Space">
      <CompactSelect
        title="test"
        choices={choices}
        selectType="switch"
        minimumSelections={1}
      />
    </div>
  );
}`
      }
      sandbox="https://codesandbox.io/s/string-switch-0zf049"
    />
    </div> 
  },
  { 
    name: "Look ups",
    demo: (theme: Theme) =>
    <div className="demo">
      <DemoItem
          title="String look-up"
          description="Look-ups can be use to get data from an external source, or to limit the number of items in the list. Performs a look-up as the user types."
          props={{
            width: "200px",
            title: "String look-up", 
            typeAheadLookUp: fetchItems
          }} 
          theme={theme}
          code={
`import CompactSelect from "compact-select";
import { fetchItems } from "./data";
import "./styles.css";

export default function App() {
  return (
    <div className="Space">
      <CompactSelect
        title="test"
        typeAheadLookUp={fetchItems}
      />
    </div>
  );
}`
        }
        sandbox="https://codesandbox.io/s/string-look-up-go9qds"
      />
      <DemoItem
          title="Cached value look-up"
          description="A cached string type ahead look-up select control. Performs a look-up as the user types and caches the values so later searches are instnace."
          props={{
            width: "200px",
            title: "Value cache", 
            typeAheadLookUp: slowFetchObjects, 
            itemValue: (item) => item.name, 
            itemText: (item) => item.name,
            cacheLookUp: true
          }} 
          theme={theme}
          code={
`import CompactSelect from "compact-select";
import { slowFetchObjects } from "./data";
import "./styles.css";

export default function App() {
  return (
    <div className="Space">
      <CompactSelect
        title="test"
        typeAheadLookUp={slowFetchObjects}
        itemValue={(item) => item.name} 
        itemText={(item) => item.name}
        cacheLookUp={true}
      />
    </div>
  );
}`
        }
        sandbox="https://codesandbox.io/s/cached-value-look-up-t40j5f"
      />
      <DemoItem
          title="Expiring Cached string look-up"
          description="A cached and expire string type ahead look-up select control. Performs a look-up as the user types and cahces for a limited time."
          props={{
            width: "200px",
            title: "String expire", 
            typeAheadLookUp: slowFetchItems, 
            cacheLookUp: true,
            cacheTimeToLive: 10, 
            cacheExpiryCheck: 10
          }} 
          theme={theme}
          code={
`import CompactSelect from "compact-select";
import { slowFetchItems } from "./data";
import "./styles.css";

export default function App() {
  return (
    <div className="Space">
      <CompactSelect
        title="test"
        typeAheadLookUp={slowFetchItems}
        cacheLookUp={true}
        cacheTimeToLive={10}
        cacheExpiryCheck={10}
      />
    </div>
  );
}`
        }
        sandbox="https://codesandbox.io/s/cache-string-and-expire-6yz4cg"
      />
    </div>
  },
  { 
    name: "Disabled",
    demo: (theme: Theme) =>
    <div className="demo">
      <DemoItem
          title="Disbaled string"
          description="A disbaled string select control."
          props={{
            width: "200px",
            title: "String disabled", 
            choices: choices, 
            selected: ["Sarah", "Dianna"],
            disabled: true
          }} 
          theme={theme}
          code={
`import CompactSelect from "compact-select";
import { choices } from "./data";
import "./styles.css";

export default function App() {
  return (
    <div className="Space">
      <CompactSelect
        title="test"
        choices={choices}
        selected={["Sarah", "Dianna"]}
        disabled={true}
      />
    </div>
  );
}`
        }
        sandbox="https://codesandbox.io/s/disabled-string-1tl6jk"
      />
      <DemoItem
          title="Disbaled items in typed value"
          description="A typed value select control with disabled items."
          props={{
            width: "200px",
            title: "Typed look-up", 
            choices: typedObjectChoices
          }} 
          theme={theme}
          code={
`import CompactSelect from "compact-select";
import { choices } from "./data";
import "./styles.css";

export default function App() {
  return (
    <div className="Space">
      <CompactSelect
        title="test"
        choices={choices}
      />
    </div>
  );
}`
        }
        sandbox="https://codesandbox.io/s/disabled-items-8e2h2h"
      />
    </div> 
  },
  { 
    name: "Paste select",
    demo: (theme: Theme) =>
    <div className="demo">
      <div className="copy-text">
        <p>Copy for string and object paste</p>
        <ClipboardCopy text={bigString}/>
      </div>
      <DemoItem
          title="Paste strings"
          description="An example of pasting strings to select strings."
          props={{
            width: "200px",
            title: "String paste", 
            typeAheadLookUp: fetchItems, 
            itemSearch: searchItems
          }} 
          theme={theme}
          code={
`import CompactSelect from "compact-select";
import { fetchItems, searchItems } from "./data";
import "./styles.css";

export default function App() {
  return (
    <div className="Space">
      <CompactSelect
        title="test"
        typeAheadLookUp={fetchItems}
        itemSearch={searchItems}
      />
    </div>
  );
}`
        }
        sandbox="https://codesandbox.io/s/paste-strings-vebiz6"
      />
      <div className="copy-text">
        <p>Copy for typed paste</p>
        <ClipboardCopy text={bigTypesObjectString}/>
      </div>
      <DemoItem
          title="Paste values for typed"
          description="An example of pasting strings to select typed objects."
          props={{
            width: "200px",
            title: "Object paste", 
            typeAheadLookUp: fetchTyped,
            itemSearch: searchTyped
          }} 
          theme={theme}
          code={
`import CompactSelect from "compact-select";
import { fetchTyped,searchTyped } from "./data";
import "./styles.css";

export default function App() {
  return (
    <div className="Space">
      <CompactSelect
        title="test"
        typeAheadLookUp={fetchTyped}
        itemSearch={searchTyped}
      />
    </div>
  );
}`
        }
        sandbox="https://codesandbox.io/s/paste-vales-sccd7y"
      />
    </div>
  },
  { 
    name: "Custom styling",
    demo: (theme: Theme) =>
    <div className="demo">
      <DemoItem
          title="Custom styles"
          description="An example of how to customise the compact select using classes and inline sytles."
          props={{
            width: "200px",
            title: "Style", 
            choices:choices,
            selected: ["Nuala", "Andrew"],
            selectStyle: {
              boxShadow: "5px 5px 10px 2px rgba(0,0,0,.8)"
            },
            clearSelectionClassName: "icon-spin",
            choiceStyle: {
              textShadow: `2px 2px ${theme.selectFont}`
            },
            choiceSelectedIconClassName: "icon-blink"
          }} 
          theme={theme}
          code={
`import CompactSelect from "compact-select";
import { choices } from "./data";
import "./styles.css";

export default function App() {
  return (
    <div className="Space">
      <CompactSelect
        title="test"
        choices={choices}
        selected={["Nuala", "Andrew"]}
        selectStyle={{
          boxShadow: "5px 5px 10px 2px rgba(0,0,0,.8)"
        }}
        clearSelectionClassName="icon-spin"
        choiceStyle={{
          textShadow: "2px 2px black"
        }}
        choiceSelectedIconClassName="icon-blink"
      />
    </div>
  );
}`
        }
        sandbox="https://codesandbox.io/s/custom-styles-dwlc5y"
      />
      
    </div>
  },
  { 
    name: "Custom components",
    demo: (theme: Theme) =>
    <div className="demo">
      <DemoItem
          title="Custom component"
          description="An example of how to use a component to change the look of the control."
          props={{
            width: "200px",
            title: "Component", 
            choices:colorChoices,
            choiceComponent: choice,
            displayComponent: display,
            maximumSelections: 1
          }} 
          theme={theme}
          code={
`import CSS from "csstype";
import CompactSelect, {
  ChoiceStyle,
  ChoiceProps,
  DisplayProps,
  DisplayStyle
} from "compact-select";
import { choices, ColorItem } from "./data";
import "./styles.css";

export default function App() {
  const itemDisplay = (
    text: string,
    color: CSS.Property.Color,
    fontColor: CSS.Property.Color,
    highlight: boolean
  ): JSX.Element => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: "10px"
      }}
    >
      {text !== "" && (
        <div
          style={{
            backgroundColor: color,
            height: "10px",
            width: "10px",
            borderRadius: "15px"
          }}
        />
      )}
      <p
        style={{
          marginBlockStart: "0px",
          marginBlockEnd: "0px",
          color: highlight ? "lightgreen" : fontColor,
          fontWeight: highlight ? "bold" : "normal"
        }}
      >
        {text}
      </p>
    </div>
  );

  const choice = <T extends object | string>(
    props: ChoiceProps<T> & ChoiceStyle
  ) => {
    return (
      <div
        key={(props.item as ColorItem).value}
        onClick={() => props.onSelected(props.item)}
      >
        {itemDisplay(
          (props.item as ColorItem).text,
          (props.item as ColorItem).color,
          props.choiceColor ?? "black",
          props.choiceSelected
        )}
      </div>
    );
  };

  const itemText = <T extends object | string>(selected: T[]): string =>
    selected.length === 0 ? "" : (selected[0] as ColorItem).text;

  const itemColor = <T extends object | string>(selected: T[]): string =>
    selected.length === 0 ? "black" : (selected[0] as ColorItem).color;

  const display = <T extends object | string>(
    props: DisplayStyle & DisplayProps<T>
  ) => (
    <div>
      {itemDisplay(
        itemText(props.selected),
        itemColor(props.selected),
        props.color ?? "black",
        false
      )}
    </div>
  );

  return (
    <div className="Space">
      <CompactSelect
        title="test1"
        choices={choices}
        choiceComponent={choice}
        displayComponent={display}
        maximumSelections={1}
      />
    </div>
  );
}`
        }
        sandbox="https://codesandbox.io/s/custom-components-olehel?file=/src/App.tsx"
      />
      
    </div>
  }
]