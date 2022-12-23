import React, { useState, FC } from "react";
import VerticalMenu from "../VerticalMenu/VerticalMenu";
import { Theme } from "../interfaces/theme";
import { guides, GuideItem } from "./Guides";
import "./HowTo.css";

interface HowToProps {
  theme: Theme;
}

const HowTo : FC<HowToProps> = ({theme}) => {
  const [guide,setGuide] = useState<string>();

  const constructGuide = (demoName: string, theme: Theme): JSX.Element => {
    const guideItem: GuideItem | undefined = guides.find( cat => cat.name === demoName);
    return guideItem 
      ? guideItem?.guide(theme)
      : <div></div>
  }

  return (
    <div 
      className="how-to"
      style={{
        color: theme.font
      }}
    >
      <VerticalMenu
        theme={theme}
        title="Guides"
        options={guides.map( g => g.name )}
        onSelect={setGuide}
      />
      <div className="guides">
        {
          guide &&constructGuide(guide, theme)
        }
      </div>
    </div>
  );
};

export default HowTo;

