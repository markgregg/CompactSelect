import { FC, useState } from "react";
import { CodeBlock, googlecode } from "react-code-blocks";
import { ClipboardCopy } from "../components";
import { Theme } from "../interfaces/theme";
import "./HowTo.css";

type GuideEntry = {
  type:  "h3" | "h4" | "h5" | "h6" | "p" | "*" | "code"
  text: string
  className?: string
}

interface GuideProperties {
  theme: Theme;
  title: string;
  entries: GuideEntry[];
}


const Guide: FC<GuideProperties> = ({title, entries, theme}) => {
  const [showCode,setShowCode] = useState<string>("");

  return (
    <div 
      className="guide"
      key={"guide" + title}
    >
      <h2 className="guide-title">{title}</h2>
      <div className="guide-body">
        {
          entries.map( entry => {
            switch(entry.type) {
              case "h3":
                return <h3 className={entry.className}>{entry.text}</h3>
              case "h4":
                return <h4 className={entry.className}>{entry.text}</h4>
              case "h5":
                return <h5 className={entry.className}>{entry.text}</h5>
              case "h6":
                return <h6 className={entry.className}>{entry.text}</h6>
              case "*":
                return <p className={`indent tight ${entry.className}` }><b className="bullet">&#x2022;</b><em>{entry.text}</em></p>
              case "code":
                return <div className={`code ${entry.className}`}>
                      <CodeBlock
                        width="100%"
                        text={entry.text}
                        language="typescript"
                        showLineNumbers={false}
                        theme={googlecode}
                      />
                    </div>
                  default:
                    return <p>{entry.text}</p>
            }
          })
        }
      </div>
    </div>
  )
}

export interface GuideItem {
  name: string;
  guide: (theme: Theme) => JSX.Element;
}

export const guides: GuideItem[] = [
  {
    name: "Binding",
    guide: (theme: Theme) => 
      <Guide
        theme={theme}
        title="Binding"
        entries={[
          {
            type: "h3", 
            text: "Overview"
          },
          {
            type: "p", 
            text: "Binding should be straight forward, and it should be possible for the type being bound to a control to be intferred. If an array of strings, or an array of objects that supports the Choice interface are supplied, then there will be nothing to do (see below)."
          },
          {
            type: "code", 
            text: `
                  <CompactSelect
                    title="test"
                    choices={choices}
                  />
              `
          },
          {
            type: "p", 
            text: "If an array of object is supplied that are not strings and does not support the Choice interface, then the following properties are required."
          },
          {
            type: "*", 
            text: "itemText, informs the control how to get display text for an item."
          },
          {
            type: "*", 
            text: "itemValue, informs the control how to get the items value."
          },
          {
            type: "*", 
            text: "disabled, is used to inform the control that an item cannot be selected."
          },
          {
            type: "code", 
            text: `
              <CompactSelect
                title="test"
                choices={objectChoices}
                itemValue={(item) => item.name} 
                itemText={(item) => item.name}
                itemDisabled={(item) => item.disabled}
              />
            `,
            className: "top-space"
          }
        ]}
      />
  }
]
