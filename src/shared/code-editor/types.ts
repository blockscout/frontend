// SPDX-License-Identifier: LicenseRef-Blockscout

import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export interface File {
  readonly key: string;
  readonly display_path: string;
  readonly source_code: string;
}

export interface FileTreeFile extends File {
  name: string;
}

export interface FileTreeFolder {
  name: string;
  children: Array<FileTreeFile | FileTreeFolder>;
}

export type FileTree = Array<FileTreeFile | FileTreeFolder>;

export type Monaco = typeof monaco;

export interface SearchResult {
  readonly key: string;
  readonly display_path: string;
  matches: Array<SearchResultMatch>;
}

export interface SearchResultMatch extends Pick<monaco.editor.FindMatch['range'], 'startColumn' | 'endColumn' | 'startLineNumber' | 'endLineNumber'> {
  lineContent: string;
}
