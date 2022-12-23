import React, { FC } from "react";
import { Theme } from "../interfaces/theme";
import "./About.css";

interface AboutProps {
  theme: Theme;
}

const About : FC<AboutProps> = ({theme}) => {
  return (
    <div 
      className="about"
      style={{
        color: theme.font
      }}
    >
      <h2>The why</h2>
      <p>When looking for a select control, I struggled to find anything that offered the functionality required, while at the same time not taking up large amounts of screen real-estate. It was because of that, and having never created an open source React offering, I decided to create CompactSelect.</p>
      <p>The functional requirements were –</p>
      <p className="indent"><b className="bullet">&#x2022;</b><em>To support differing numbers of selections. Some of the fields on our page could have one value, while others could have multiple. Additionally, some had to have a value, while others didn’t</em></p>
      <p className="indent"><b className="bullet">&#x2022;</b><em>Type ahead look-up. We up to sixty thousand values in some fields, a type ahead option was vital.</em></p>
      <p className="indent"><b className="bullet">&#x2022;</b><em>The ability to paste in 200 comma delimited customer codes and to have the records selected.</em></p>
    </div>
  );
};

export default About;