export interface File {
  file_path: string;
  source_code: string;
}

export interface FileTreeFile extends File {
  name: string;
}

export interface FileTreeFolder {
  name: string;
  children: Array<FileTreeFile | FileTreeFolder>;
}

export type FileTree = Array<FileTreeFile | FileTreeFolder>;
