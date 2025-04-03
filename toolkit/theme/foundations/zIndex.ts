export const zIndex = {
  hide: { value: -1 },
  auto: { value: 'auto' },
  base: { value: 0 },
  docked: { value: 10 },
  dropdown: { value: 1000 },
  sticky: { value: 1100 },
  sticky1: { value: 1101 },
  sticky2: { value: 1102 },
  banner: { value: 1200 },
  overlay: { value: 1300 },
  modal: { value: 1400 },
  popover: { value: 1500 },
  tooltip: { value: 1550 }, // otherwise tooltips will not be visible in modals
  tooltip2: { value: 1551 }, // for tooltips in tooltips
  skipLink: { value: 1600 },
  toast: { value: 1700 },
};

export default zIndex;
