import CompactSelect from "compact-select";
import React, { useEffect, useState } from "react";
import About from "./About/About";
import Examples from "./Examples/Examples";
import HowTo from "./HowTo/HowTo";
import "./App.css";
import { applyTheme, themes, Themes } from "./themes/themes";

const pages = ["About", "Examples"];

const App = () => {
  const [themeName, setThemeName] = useState<string>(Themes.None.toString());
  const [page, setPage] = useState<string>("Examples");
  
  useEffect(()=> {
    applyTheme(Themes.None);
  },[])

  const setTheme = (theme: string[]) => {
    setThemeName(theme[0]);
    applyTheme(theme[0]);
  }

  return (
    <div className="frame">
      <div className="page">
        <div
          className="body">
          <div className="header">
            <h1 className="title">Compact Select</h1>
            <p className="statement">
              A simple, flexible select control that's economical in terms of
              realestate
            </p>
          </div>
          <div
            className="menu-bar"
          >
            <div className="menu">
              {pages.map((pg) => (
                <div
                  key={pg}
                  className="menu-item"
                  onClick={() => setPage(pg)}
                >
                  <p className="menu-text">{pg}</p>
                </div>
              ))}
            </div>
            <div className="theme">
              <CompactSelect
                maximumSelections={1}
                minimumSelections={1}
                selectType="dropdown"
                title="themes"
                choices={themes}
                selected={themeName}
                onChange={setTheme}
              />
            </div>
          </div>
          <div className="context">
            {(page === "Examples" && <Examples />) ||
              (page === "About" && <About />) ||
              (page === "How-To" && <HowTo />)}
          </div>
          <div
            className="footer"
            style={{
              backgroundColor: "var(--pageColor2)",
              color: "var(--compactSelectFontColor)",
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
