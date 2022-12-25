import CompactSelect from "compact-select";
import React, { useState } from "react";
import About from "./About/About";
import Examples from "./Examples/Examples";
import "./App.css";
import { Themes, themeMap, themes } from "./data/data";

import { Theme } from "./interfaces/theme";
import HowTo from "./howTo/HowTo";

const pages = ["About", "Examples", "How-To"];

const App = () => {
  const [theme, setTheme] = useState<Theme>(
    themeMap.get(Themes.Blue.toString())!
  );
  const [page, setPage] = useState<string>("Examples");
  const [pageHighlight, setPageHighlight] = useState<string>();

  const setNewTheme = (theme: string | string[] | undefined) => {
    if (theme) {
      const newTheme = themeMap.get(theme as string);
      if (newTheme) {
        setTheme(newTheme);
      }
    }
  };

  return (
    <div className="frame">
      <div className="page">
        <div
          className="body"
          style={{
            backgroundColor: theme.page1,
            color: theme.font,
          }}
        >
          <div className="header">
            <h1 className="title">Compact Select</h1>
            <p className="statement">
              A simple, flexible select control that's economical in terms of
              realestate
            </p>
          </div>
          <div
            className="menu-bar"
            style={{
              backgroundColor: theme.page2,
            }}
          >
            <div className="menu">
              {pages.map((pg) => (
                <div
                  key={pg}
                  className="menu-item"
                  style={{
                    color:
                      pg === pageHighlight ? theme.page3 : theme.selectFont,
                  }}
                  onClick={() => setPage(pg)}
                  onMouseEnter={() => setPageHighlight(pg)}
                  onMouseLeave={() => setPageHighlight(undefined)}
                >
                  <p className="menu-text">{pg}</p>
                </div>
              ))}
            </div>
            <div className="theme">
              <CompactSelect
                backgroundColor={theme.page2}
                color={theme.selectFont}
                choiceHoverBackgroundColor={theme.page3}
                maximumSelections={1}
                minimumSelections={1}
                selectType="dropdown"
                border="none"
                title="themes"
                choices={themes}
                onChange={setNewTheme}
              />
            </div>
          </div>
          <div className="context">
            {(page === "Examples" && <Examples theme={theme} />) ||
              (page === "About" && <About theme={theme} />) ||
              (page === "How-To" && <HowTo theme={theme} />)}
          </div>
          <div
            className="footer"
            style={{
              backgroundColor: theme.page2,
              color: theme.selectFont,
            }}
          >
            <p>Created by Mark Gregg</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
