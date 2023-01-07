export enum Themes {
  None = "None",
  Dark = "Dark",
  Light = "Light",
  Blue = "Blue",
}

export const themes = Object.keys(Themes).filter((item) => {
  return isNaN(Number(item));
});

export const applyTheme = (theme: string) => {
  switch(theme){
    case Themes.Blue: 
      document.documentElement.style.setProperty("--compactSelectBackgroundColor", "#353576");
      document.documentElement.style.setProperty("--compactSelectFontColor", "White");
      document.documentElement.style.setProperty("--compactSelectFonHighlightColor", "LightGray");
      document.documentElement.style.setProperty("--compactSelectDisabledBackgroundColor", "#5555ad");
      document.documentElement.style.setProperty("--compactSelectToolTipBackgroundColor", "#5555ad");
      document.documentElement.style.setProperty("--compactSelectHighlightedBackgroundColor", "#9c9ccb");
      document.documentElement.style.setProperty("--compactSelectBorder", "none");
      document.documentElement.style.setProperty("--pageColor1", "rgb(195, 212, 233)");
      document.documentElement.style.setProperty("--pageColor2", "#353576");
      document.documentElement.style.setProperty("--pageColor3", "#9c9ccb");
      document.documentElement.style.setProperty("--pageFont", "Black");
      break;
     case Themes.Dark: 
      document.documentElement.style.setProperty("--compactSelectBackgroundColor", "#430770");
      document.documentElement.style.setProperty("--compactSelectFontColor", "Gainsboro");
      document.documentElement.style.setProperty("--compactSelectFonHighlightColor", "DarkGray");
      document.documentElement.style.setProperty("--compactSelectDisabledBackgroundColor", "#512E6B");
      document.documentElement.style.setProperty("--compactSelectToolTipBackgroundColor", "#512E6B");
      document.documentElement.style.setProperty("--compactSelectHighlightedBackgroundColor", "#9C2BF1");
      document.documentElement.style.setProperty("--compactSelectBorder", "none");
      document.documentElement.style.setProperty("--pageColor1", "Black");
      document.documentElement.style.setProperty("--pageColor2", "#430770");
      document.documentElement.style.setProperty("--pageColor3", " #9C2BF1");
      document.documentElement.style.setProperty("--pageFont", "Gainsboro");
      break;
    case Themes.Light: 
      document.documentElement.style.setProperty("--compactSelectBackgroundColor", "#E7C504");
      document.documentElement.style.setProperty("--compactSelectFontColor", "#3D350B");
      document.documentElement.style.setProperty("--compactSelectFonHighlightColor", "DarkGray");
      document.documentElement.style.setProperty("--compactSelectDisabledBackgroundColor", "#d5b70e");
      document.documentElement.style.setProperty("--compactSelectToolTipBackgroundColor", "#d5b70e");
      document.documentElement.style.setProperty("--compactSelectHighlightedBackgroundColor", "#FCE355");
      document.documentElement.style.setProperty("--compactSelectBorder", "none");
      document.documentElement.style.setProperty("--pageColor1", "#FEF4B9");
      document.documentElement.style.setProperty("--pageColor2", "#E7C504");
      document.documentElement.style.setProperty("--pageColor3", "#FCE355");
      document.documentElement.style.setProperty("--pageFont", "#3D350B");
      break;
    case Themes.None: 
      document.documentElement.style.setProperty("--compactSelectBackgroundColor", null);
      document.documentElement.style.setProperty("--compactSelectFontColor", null);
      document.documentElement.style.setProperty("--compactSelectFonHighlightColor", null);
      document.documentElement.style.setProperty("--compactSelectDisabledBackgroundColor", null);
      document.documentElement.style.setProperty("--compactSelectToolTipBackgroundColor", null);
      document.documentElement.style.setProperty("--compactSelectHighlightedBackgroundColor",null);
      document.documentElement.style.setProperty("--compactSelectBorder", null);
      document.documentElement.style.setProperty("--pageColor1", "White");
      document.documentElement.style.setProperty("--pageColor2", "#CEE538");
      document.documentElement.style.setProperty("--pageColor3", "#849513");
      document.documentElement.style.setProperty("--pageFont", "Black");
      break;
  }
  
}



