import { ChoiceStyle, SelectProps, ToolTipStyle, SelectStyle } from "../types";
export interface CompactSelectProps<T extends object | string> extends SelectProps<T>, SelectStyle, ChoiceStyle, ToolTipStyle {
}
declare const CompactSelect: <T extends string | object>(props: CompactSelectProps<T>) => JSX.Element;
export default CompactSelect;
