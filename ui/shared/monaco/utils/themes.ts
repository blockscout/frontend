import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const light: monaco.editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#f5f5f6',
  },
};

export const dark: monaco.editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#1a1b1b',
  },
};
