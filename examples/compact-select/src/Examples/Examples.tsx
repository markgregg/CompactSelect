import React, { useState, FC } from "react";
import VerticalMenu from "../VerticalMenu/VerticalMenu";
import { Theme } from "../interfaces/theme";
import { categories } from "./Demos";
import "./Examples.css";

interface ExamplesProps {
  theme: Theme;
}

const Examples: FC<ExamplesProps> = ({ theme }) => {
  const [demo, setDemo] = useState<string>();

  const constructDemo = (demoName: string, theme: Theme): JSX.Element => {
    const category = categories.find((cat) => cat.name === demoName);
    return category ? category?.demo(theme) : <div></div>;
  };

  return (
    <div
      className="examples"
      style={{
        color: theme.font,
      }}
    >
      <VerticalMenu
        theme={theme}
        title="Catagories"
        options={categories.map((c) => c.name)}
        onSelect={setDemo}
      />
      <div className="controls">{demo && constructDemo(demo, theme)}</div>
    </div>
  );
};

export default Examples;
