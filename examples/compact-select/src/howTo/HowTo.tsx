import { useState } from "react";
import VerticalMenu from "../VerticalMenu/VerticalMenu";
import { guides, GuideItem } from "./Guides";
import "./HowTo.css";

const HowTo = () => {
  const [guide, setGuide] = useState<string>();

  const constructGuide = (demoName: string): JSX.Element => {
    const guideItem: GuideItem | undefined = guides.find(
      (cat) => cat.name === demoName
    );
    return guideItem ? guideItem?.guide() : <div></div>;
  };

  return (
    <div
      className="how-to"
    >
      <VerticalMenu
        title="Guides"
        options={guides.map((g) => g.name)}
        onSelect={setGuide}
      />
      <div className="guides">{guide && constructGuide(guide)}</div>
    </div>
  );
};

export default HowTo;
