import React, { useState, FC } from "react";
import { Theme } from "../interfaces/theme";
import { categories } from "./Demos";
import "./Examples.css";

interface ExamplesProps {
  theme: Theme
}

const Examples : FC<ExamplesProps> = ({theme}) => {
  const [demo,setDemo] = useState<string>();
  const [highlight,setHighlight] = useState<string>();

  const constructDemo = (demoName: string, theme: Theme): JSX.Element => {
    const category = categories.find( cat => cat.name === demoName);
    return ( category) ? 
      category?.demo(theme)
      : <div></div>
  }

  return (
    <div 
      className="examples"
      style={{
        color: theme.font
      }}
    >
      <div 
        className="categories"
        style={{
          backgroundColor: theme.page2,
          color: theme.selectFont
        }}
      >
        <h3 className="catagory-heading">
          Categories
        </h3>
        <ul className="catagory-list" >
          {
            categories.map( category =>
              <li 
                key={category.name}
                className="catagory-item"
                style={{
                  backgroundColor: highlight === category.name || category.name === demo ? theme.page3 : theme.page2
                }}
                onMouseEnter={() => setHighlight(category.name)}
                onMouseLeave={() => setHighlight(undefined)}
                onClick={ () => { setDemo( category.name ) }}
              >
                <p className="catagory-text">{category.name}</p>
              </li>
            )
          }
        </ul>
      </div>
      <div className="controls">
        {
          demo &&constructDemo(demo, theme)
        }
      </div>
    </div>
  );
};

export default Examples;
