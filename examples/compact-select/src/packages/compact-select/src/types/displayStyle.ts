import CSS from 'csstype';

export interface DisplayStyle {
  displayStyle?: CSS.Properties;
  displayDisabledStyle?: CSS.Properties;
  displayClassName?: CSS.Properties;
  displayDisabledClassName?: string;
}
