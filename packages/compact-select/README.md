# CompactSelect

CompactSelect is a select control that is light in terms of screen realestate but at the same time highly functional

For examples and help [compact-select](https://markgregg.github.io/CompactSelect/)

## To install

yarn add compact-select

npm i --save compact-select

## Quick start

A simple string list
<CompactSelect
  title="test"
  choices={choices}
/>

## Properties

- title - select control title and use as a key for caching items
- maximumSelections - min items that can be selected
- minimumSelections - max items that can be selected
- selectType - how the control behaves "standard" | "dropdown" | "switch"
- choices - available static choices
- selected - currently selected items
- itemValue - if using a complex class how to access the key value
- itemText - if using a complex class how to access the display value
- itemDisabled - if using a complex class how to access the disabled value
- typeAheadLookUp - type ahead lookup callback
- noEmptyStringLookUp - don't loook up if the input string is blank
- itemSearch? - item search for when pasting from the clipboard
- cacheLookUp - should the control cache items
- cacheTimeToLive - how long should items exist for, in seconds
- cacheExpiryCheck - how often should item expiry be checked, in seconds
- onChange - notify of change
- disabled - is control disable
- loadingText - custom loading text
- noItemText - custom no item text
- caseSensitive - perform case sensitive matching
- toolTipValueLimit - maxium number of items to display in the tooltip
