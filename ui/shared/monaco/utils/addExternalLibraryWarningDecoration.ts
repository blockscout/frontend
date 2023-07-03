import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import type { SmartContractExternalLibrary } from 'types/api/contract';

export default function addExternalLibraryWarningDecoration(model: monaco.editor.ITextModel, libraries: Array<SmartContractExternalLibrary>) {
  const options: monaco.editor.IModelDecorationOptions = {
    inlineClassName: '.risk-warning',
    hoverMessage: [
      { value: '**This is an external library linked to the verified contract**' },
      // eslint-disable-next-line max-len
      { value: 'The linked library source code only affects the bytecode part with external `DELEGATECALL` to the library and it is not possible to automatically ensure that provided library is really the one deployed at specified address. If you want to be sure, check the source code of the library at the given address. (See [issue](https://github.com/blockscout/blockscout-rs/issues/532) for more details)',
      },
    ],
  };

  const names = libraries.map(getLibraryName(model)).filter(Boolean).join('|');

  if (!names) {
    return;
  }

  const matches = model.findMatches(`(^library ${ names })\\s?\\{`, false, true, false, null, true);
  const decorations: Array<monaco.editor.IModelDeltaDecoration> = matches.map(({ range, matches }) => ({
    range: {
      ...range,
      startColumn: 9,
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
