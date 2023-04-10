import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export default function addFileImportDecorations(model: monaco.editor.ITextModel) {
  const matches = model.findMatches('^import (\'|")((\\/|\\.)(\\w|\\.|\\/|-)+)(\'|")', false, true, false, null, true);
  const decorations: Array<monaco.editor.IModelDeltaDecoration> = matches.map(({ range }) => ({
    range: {
      ...range,
      startColumn: range.startColumn + 8,
      endColumn: range.endColumn - 1,
    },
    options: {
      inlineClassName: 'import-link',
      hoverMessage: {
        value: 'Cmd/Win + click to open file',
      },
    },
  }));
  model.deltaDecorations([], decorations);
}
