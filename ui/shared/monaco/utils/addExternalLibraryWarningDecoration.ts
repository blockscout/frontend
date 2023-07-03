import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import type { SmartContractExternalLibrary } from 'types/api/contract';

export default function addExternalLibraryWarningDecoration(model: monaco.editor.ITextModel, libraries: Array<SmartContractExternalLibrary>) {
  const options: monaco.editor.IModelDecorationOptions = {
    inlineClassName: '.risk-warning',
    hoverMessage: {
      // TODO @tom2drum: research more customizable tooltip
      value: 'Be careful!!!',
    },
  };

  const names = libraries.map(getLibraryName(model)).filter(Boolean).join('|');

  if (!names) {
    return;
  }

  const matches = model.findMatches(`(^library ${ names })\\s?\\{`, false, true, false, null, true);
  const decorations: Array<monaco.editor.IModelDeltaDecoration> = matches.map(({ range, matches }) => ({
    range: {
      ...range,
      startColumn: 1,
      endColumn: matches ? matches[1].length + 1 : 0,
    },
    options,
  }));

  model.deltaDecorations([], decorations);
}

const getLibraryName = (model: monaco.editor.ITextModel) => (library: SmartContractExternalLibrary) => {
  const containsFileName = library.name.includes(':');

  if (!containsFileName) {
    return library.name;
  }

  const [ fileName, libraryName ] = library.name.split(':');

  if (model.uri.path !== `/${ fileName }`) {
    return;
  }

  return libraryName;
};
