export const light = {
  base: 'vs' as const,
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#f5f5f6',
    'editor.findMatchHighlightBackground': 'rgba(234, 92, 0, 0.33)',

    'tab.activeBackground': '#f5f5f6',
    'tab.inactiveBackground': 'rgb(236, 236, 236)',
    'tab.activeForeground': '#101112', // black
    'tab.inactiveForeground': '#4a5568', // gray.600
    'tab.border': 'rgb(243, 243, 243)',

    'icon.foreground': '#616161',

    'input.foreground': 'rgb(97, 97, 97)',
    'input.background': '#fff',

    'inputOption.activeBackground': 'rgba(0, 144, 241, 0.2)',
    'inputOption.hoverBackground': 'rgba(184, 184, 184, 0.31)',

    'list.hoverBackground': 'rgba(16, 17, 18, 0.08)', // blackAlpha.200
    'list.inactiveSelectionBackground': '#e4e6f1',

    'breadcrumbs.foreground': 'rgb(97, 97, 97)',

    'badge.background': '#c4c4c4',

    'sideBar.background': '#eee',

    focusBorder: '#0090f1',
  } as const,
};

export const dark = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#1a1b1b',
    'editor.findMatchHighlightBackground': 'rgba(234, 92, 0, 0.33)',

    'tab.activeBackground': '#1a1b1b', // black
    'tab.inactiveBackground': 'rgb(45, 45, 45)',
    'tab.activeForeground': '#fff', // white
    'tab.inactiveForeground': '#a0aec0', // gray.400
    'tab.border': 'rgb(37, 37, 38)',

    'icon.foreground': '#616161',

    'input.foreground': 'rgb(204, 204, 204)',
    'input.background': 'rgb(60, 60, 60)',

    'inputOption.activeBackground': 'rgba(0, 127, 212, 0.4)',
    'inputOption.hoverBackground': 'rgba(90, 93, 94, 0.31)',

    'list.hoverBackground': 'rgba(255, 255, 255, 0.08)', // whiteAlpha.200
    'list.inactiveSelectionBackground': '#37373d',

    'badge.background': '#4d4d4d',

    'breadcrumbs.foreground': 'rgb(97, 97, 97)',

    'sideBar.background': '#222',

    focusBorder: '#007fd4',
  } as const,
};
