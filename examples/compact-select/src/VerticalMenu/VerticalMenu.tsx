import React, { useState, FC } from "react";
import { Theme } from "../interfaces/theme";
import "./VerticalMenu.css";

interface VerticalMenuProps {
  theme: Theme;
  title: string;
  options: string[];
  onSelect: (option: string) => void;
}

const VerticalMenu: FC<VerticalMenuProps> = ({
  theme,
  title,
  options,
  onSelect,
}) => {
  const [active, setActive] = useState<string>();
  const [highlight, setHighlight] = useState<string>();

  return (
    <div
      className="vmenu"
      style={{
        backgroundColor: theme.page2,
        color: theme.selectFont,
      }}
    >
      <h3 className="vmenu-heading">{title}</h3>
      <ul className="vmenu-items">
        {options.map((option) => (
          <li
            key={option}
            className="option"
            style={{
              backgroundColor:
                highlight === option || option === active
                  ? theme.page3
                  : theme.page2,
            }}
            onMouseEnter={() => setHighlight(option)}
            onMouseLeave={() => setHighlight(undefined)}
            onClick={() => {
              setActive(option);
              onSelect(option);
            }}
          >
            <p>{option}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VerticalMenu;
