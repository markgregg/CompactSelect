import { useState } from "react";
import CSS from "csstype";
import CompactSelect, {
  ChoiceProps,
  ChoiceStyle,
  CompactSelectProps, 
  DisplayProps,
  DisplayStyle,
} from "../packages/compact-select/src";
import { CodeBlock, googlecode } from "react-code-blocks";
import { ClipboardCopy } from "../components";
import { AiOutlineEdit, AiOutlineCopy, AiOutlineCode } from "react-icons/ai";
import {
  bigString,
  bigTypesObjectString,
  choices,
  colorChoices,
  ColorItem,
  groups,
  longChoices,
  objectChoices,
  typedObjectChoices,
} from "../data/data";
import {
  fetchItems,
  fetchTyped,
  searchItems,
  searchTyped,
  slowFetchItems,
  slowFetchObjects,
} from "../utils";
import "./Examples.css";

const itemDisplay = (
  text: string,
  color: CSS.Property.Color,
  highlight: boolean
): JSX.Element => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      columnGap: "10px",
    }}
  >
    {text !== "" && (
      <div
        style={{
          backgroundColor: color,
          height: "10px",
          width: "10px",
          borderRadius: "15px",
        }}
      />
    )}
    <p
      style={{
        marginBlockStart: "0px",
        marginBlockEnd: "0px",
        color: highlight ? "lightgreen" : undefined,
        fontWeight: highlight ? "bold" : "normal",
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
      false
    )}
  </div>
);

interface DemoItemProperties<T extends object | string> {
  title: string;
  description: string;
  props: CompactSelectProps<T>;
  code?: string;
  sandbox?: string;
  bindSelection?: string;
}
const DemoItem = <T extends object | string>(props: DemoItemProperties<T>) => {
  const [showCode, setShowCode] = useState<string>("");
  const [showCopied, setShowCopied] = useState<boolean>(false);
  const [selection,setSelection] = useState<T[]>([]);
  const [multiSelection,setMultiSelection] = useState<T[]>([]);

  const selectionChanged = (items: T[], single: boolean) => {
    if( single ) {
      setSelection(items);
    } else {
      setMultiSelection(items);
    }
  }

  const compactSelectProps = (): CompactSelectProps<T> => {
    switch(props.bindSelection) {
      case "single": 
        return {
          selected: selection,
          onChange: items => selectionChanged(items, true),
          ...props.props
        }
      case "multi": 
        return {
          selected: multiSelection,
          onChange: items => selectionChanged(items, false),
          ...props.props
        }
      default:
        return {
          ...props.props
        }
    }
  }
 
  return (
    <div className="demo" key={"demo" + props.title}>
      <h2 className="demo-title">{props.title}</h2>
      <div className="demo-description">
        <p>{props.description}</p>
      </div>
      <div className="demo-item">
        <CompactSelect
          key={props.title}
          {...compactSelectProps()}
        />
        <div className="icons">
          <AiOutlineCode
            onClick={() => {
              setShowCode(showCode === props.title ? "" : props.title);
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
            {showCopied && <p className="copied-text">Copied</p>}
          </div>
          <AiOutlineEdit onClick={() => window.open(props.sandbox, "_blank")} />
        </div>
      </div>
      {
        (
          props.bindSelection === "single" && <div>
            <p>selection={selection.toString()}</p>
          </div>) ||
        (
          props.bindSelection === "multi" && <div>
            <p>selection={multiSelection.toString()}</p>
          </div>
        )
      }
      {showCode === props.title && (
        <div className="code">
          <CodeBlock
            width="100%"
            text={props.code}
            language="typescript"
            showLineNumbers={false}
            theme={googlecode}
          />
        </div>
      )}
    </div>
  );
};

export interface Category {
  name: string;
  demo: () => JSX.Element;
}

export const categories: Category[] = [
  {
    name: "Binding",
    demo: () => (
      <div className="demo">
        <DemoItem
          title="String binding"
          description="The simple list of strings"
          props={{
            width: "300px",
            title: "Bind String",
            choices: choices,
          }}
          code={`import CompactSelect from "compact-select";
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
}`}
          sandbox="https://codesandbox.io/s/string-binding-9jlrb0"
        />
        <DemoItem
          title="Object binding"
          description="Bound to an array of objects, getters provide the text, value and disbaled state (if required)."
          props={{
            width: "300px",
            title: "Object binding",
            choices: objectChoices,
            itemValue: (item) => item.name,
            itemText: (item) => item.name,
            itemDisabled: (item) => item.disabled,
          }}
          
          code={`import CompactSelect from "compact-select";
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
}`}
          sandbox="https://codesandbox.io/s/object-binding-forked-d54u70"
        />
        <DemoItem
          title="Typed object binding"
          description="Bound to an array of objects that implement the Choice interface."
          props={{
            width: "300px",
            title: "Typed binding",
            choices: typedObjectChoices,
          }}
          
          code={`import CompactSelect from "compact-select";
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
}`}
          sandbox="https://codesandbox.io/s/typed-binding-cdhsme"
        />
      </div>
    ),
  },
  {
    name: "Single select",
    demo: () => (
      <div className="demo">
        <DemoItem
          title="Single string"
          description="Minimum and maximum selections set to 1."
          props={{
            width: "300px",
            title: "One String",
            choices: choices,
            maximumSelections: 1,
            minimumSelections: 1,
          }}
          
          code={`import CompactSelect from "compact-select";
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
}`}
          sandbox="https://codesandbox.io/s/simple-single-string-compact-select-j6hpei"
        />
        <DemoItem
          title="Single or no value"
          description="Maximum selections set to 1."
          props={{
            width: "300px",
            title: "One/Zero value",
            choices: objectChoices,
            maximumSelections: 1,
            itemValue: (item) => item.name,
            itemText: (item) => item.name,
          }}
          
          code={`import CompactSelect from "compact-select";
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
}`}
          sandbox="https://codesandbox.io/s/simple-single-no-value-compact-select-oskfme"
        />
        <DemoItem
          title="Single bound selection"
          description="Bound to state."
          props={{
            width: "300px",
            title: "Single bound",
            choices: choices,
            maximumSelections: 1,
            minimumSelections: 1,
          }}
          bindSelection="single"
          code={`import CompactSelect from "compact-select";
          import { useState } from "react";
          import { choices } from "./data";
          import "./styles.css";
          
          export default function App() {
            const [selected, setSelected] = useState<String[]>([]);
            return (
              <div className="Space">
                <CompactSelect
                  title="test"
                  choices={choices}
                  selected={selected}
                  maximumSelections={1}
                  minimumSelections={1}
                  onChange={setSelected}
                />
              </div>
            );
          }`}
          sandbox="https://codesandbox.io/s/simple-single-string-compact-select-bound-to-sate-tlbmhf"
        />
      </div>
    ),
  },
  {
    name: "Multi select",
    demo: () => (
      <div className="demo">
        <DemoItem
          title="Multi string"
          description="Unlimited number of selections."
          props={{
            width: "300px",
            title: "Multi string",
            choices: choices,
          }}
          
          code={`import CompactSelect from "compact-select";
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
}`}
          sandbox="https://codesandbox.io/s/multi-string-compact-select-2wbrc2"
        />
        <DemoItem
          title="Fixed multi value"
          description="Limited to a specific number of selections, in this case three."
          props={{
            width: "300px",
            title: "Three objects",
            choices: objectChoices,
            maximumSelections: 3,
            itemValue: (item) => item.name,
            itemText: (item) => item.name,
          }}
          
          code={`import CompactSelect from "compact-select";
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
}`}
          sandbox="https://codesandbox.io/s/multi-string-compact-select-bound-gr13pq"
        />
         <DemoItem
          title="Multi bound selection"
          description="Bound to state"
          props={{
            width: "300px",
            title: "Multi bound",
            choices: choices,
          }}
          bindSelection="multi"
          code={`import { useState } from "react";
          import CompactSelect from "compact-select";
          import { choices } from "./data";
          import "./styles.css";
          
          export default function App() {
            const [selected, setSelected] = useState<String[]>([]);
            
            return (
              <div className="Space">
                <CompactSelect
                  title="test"
                  choices={choices}
                  selected={selected}
                  onChange={setSelected}
                />
              </div>
            );
          }`}
          sandbox="https://codesandbox.io/s/multi-string-compact-select-2wbrc2"
        />
      </div>
    ),
  },
  {
    name: "Long strings",
    demo: () => (
      <div className="demo">
        <DemoItem
          title="Long string"
          description="Truncated text."
          props={{
            width: "300px",
            title: "Long string",
            choices: longChoices,
          }}
          
          code={`import CompactSelect from "compact-select";
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
}`}
          sandbox="https://codesandbox.io/s/multi-string-compact-select-2wbrc2"
        />
      </div>
    ),
  },
  {
    name: "Select All",
    demo: () => (
      <div className="demo">
        <DemoItem
          title="Select all"
          description="Truncated text."
          props={{
            width: "300px",
            title: "Select all",
            choices: choices,
            allowSelectAll: true
          }}
          
          code={`import CompactSelect from "compact-select";
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
}`}
          sandbox="https://codesandbox.io/s/multi-string-compact-select-2wbrc2"
        />
      </div>
    ),
  },
  {
    name: "Groups",
    demo: () => (
      <div className="demo">
        <DemoItem
          title="Groups"
          description="Grouped items."
          props={{
            width: "300px",
            title: "Groups",
            choices: groups,
          }}
          
          code={`import CompactSelect from "compact-select";
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
}`}
          sandbox="https://codesandbox.io/s/multi-string-compact-select-2wbrc2"
        />
      </div>
    ),
  },
  {
    name: "Dropdown lists",
    demo: () => (
      <div className="demo">
        <DemoItem
          title="Single string dropdown"
          description="A simple single value dropdown list with no lookup"
          props={{
             width: "300px",
            title: "String dropdown",
            choices: choices,
            maximumSelections: 1,
            selectType: "dropdown",
          }}
          
          code={`import CompactSelect from "compact-select";
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
}`}
          sandbox="https://codesandbox.io/s/single-string-dropdown-er55j4"
        />
        <DemoItem
          title="Multi value dropdown"
          description="A multi value dropdown list."
          props={{
            width: "300px",
            title: "Values dropdown",
            choices: objectChoices,
            selectType: "dropdown",
            itemValue: (item) => item.name,
            itemText: (item) => item.name,
          }}
          
          code={`import CompactSelect from "compact-select";
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
}`}
          sandbox="https://codesandbox.io/s/multi-value-dropdown-z5sbbo"
        />
      </div>
    ),
  },
  {
    name: "Switches",
    demo: () => (
      <div className="demo">
        <DemoItem
          title="String switch"
          description="A switch that alternates between values."
          props={{
            width: "120px",
            hideTitle: true,
            title: "String switch",
            choices: choices,
            selectType: "switch",
            minimumSelections: 1,
          }}
          
          code={`import CompactSelect from "compact-select";
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
}`}
          sandbox="https://codesandbox.io/s/string-switch-0zf049"
        />
      </div>
    ),
  },
  {
    name: "Look ups",
    demo: () => (
      <div className="demo">
        <DemoItem
          title="String look-up"
          description="Look-ups can be use to get data from an external source, or to limit the number of items in the list. Performs a look-up as the user types."
          props={{
            width: "300px",
            title: "String look-up",
            typeAheadLookUp: fetchItems,
          }}
          
          code={`import CompactSelect from "compact-select";
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
}`}
          sandbox="https://codesandbox.io/s/string-look-up-go9qds"
        />
        <DemoItem
          title="Cached value look-up"
          description="A cached string type ahead look-up select control. Performs a look-up as the user types and caches the values so later searches are instnace."
          props={{
            width: "300px",
            title: "Value cache",
            typeAheadLookUp: slowFetchObjects,
            itemValue: (item) => item.name,
            itemText: (item) => item.name,
            cacheLookUp: true,
          }}
          
          code={`import CompactSelect from "compact-select";
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
}`}
          sandbox="https://codesandbox.io/s/cached-value-look-up-t40j5f"
        />
        <DemoItem
          title="Expiring Cached string look-up"
          description="A cached and expire string type ahead look-up select control. Performs a look-up as the user types and cahces for a limited time."
          props={{
            width: "300px",
            title: "String expire",
            typeAheadLookUp: slowFetchItems,
            cacheLookUp: true,
            cacheTimeToLive: 10,
            cacheExpiryCheck: 10,
          }}
          
          code={`import CompactSelect from "compact-select";
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
}`}
          sandbox="https://codesandbox.io/s/cache-string-and-expire-6yz4cg"
        />
      </div>
    ),
  },
  {
    name: "Disabled",
    demo: () => (
      <div className="demo">
        <DemoItem
          title="Disbaled string"
          description="A disbaled string select control."
          props={{
            width: "300px",
            title: "String disabled",
            choices: choices,
            selected: ["Sarah", "Dianna"],
            disabled: true,
          }}
          
          code={`import CompactSelect from "compact-select";
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
}`}
          sandbox="https://codesandbox.io/s/disabled-string-1tl6jk"
        />
        <DemoItem
          title="Disbaled items in typed value"
          description="A typed value select control with disabled items."
          props={{
            width: "300px",
            title: "Typed look-up",
            choices: typedObjectChoices,
          }}
          
          code={`import CompactSelect from "compact-select";
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
}`}
          sandbox="https://codesandbox.io/s/disabled-items-8e2h2h"
        />
      </div>
    ),
  },
  {
    name: "Paste select",
    demo: () => (
      <div className="demo">
        <div className="copy-text">
          <p>Copy for string and object paste</p>
          <ClipboardCopy text={bigString} />
        </div>
        <DemoItem
          title="Paste strings"
          description="An example of pasting strings to select strings."
          props={{
            width: "300px",
            title: "String paste",
            typeAheadLookUp: fetchItems,
            itemSearch: searchItems,
          }}
          
          code={`import CompactSelect from "compact-select";
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
}`}
          sandbox="https://codesandbox.io/s/paste-strings-vebiz6"
        />
        <div className="copy-text">
          <p>Copy for typed paste</p>
          <ClipboardCopy text={bigTypesObjectString} />
        </div>
        <DemoItem
          title="Paste values for typed"
          description="An example of pasting strings to select typed objects."
          props={{
            width: "300px",
            title: "Object paste",
            typeAheadLookUp: fetchTyped,
            itemSearch: searchTyped,
          }}
          
          code={`import CompactSelect from "compact-select";
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
}`}
          sandbox="https://codesandbox.io/s/paste-vales-sccd7y"
        />
      </div>
    ),
  },
  {
    name: "Custom styling",
    demo: () => (
      <div className="demo">
        <DemoItem
          title="Custom styles"
          description="An example of how to customise the compact select using classes and inline sytles."
          props={{
            width: "300px",
            title: "Style",
            choices: choices,
            selected: ["Nuala", "Andrew"],
            selectStyle: {
              boxShadow: "5px 5px 10px 2px rgba(0,0,0,.8)",
            },
            clearSelectionClassName: "icon-spin",
            choiceStyle: {
              textShadow: `2px 2px var(compactSelectFontColor)`,
            },
            choiceSelectedIconClassName: "icon-blink",
          }}
          
          code={`import CompactSelect from "compact-select";
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
}`}
          sandbox="https://codesandbox.io/s/custom-styles-dwlc5y"
        />
      </div>
    ),
  },
  {
    name: "Custom components",
    demo: () => (
      <div className="demo">
        <DemoItem
          title="Custom component"
          description="An example of how to use a component to change the look of the control."
          props={{
            width: "300px",
            title: "Component",
            choices: colorChoices,
            choiceComponent: choice,
            displayComponent: display,
            maximumSelections: 1,
          }}
          
          code={`import CSS from "csstype";
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
}`}
          sandbox="https://codesandbox.io/s/custom-components-olehel?file=/src/App.tsx"
        />
      </div>
    ),
  },
];
