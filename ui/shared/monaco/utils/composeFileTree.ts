import type { File, FileTree } from '../types';

import sortFileTree from './sortFileTree';

const stripLeadingSlash = (str: string) => {
  if (str[0] === '.' && str[1] === '/') {
    return str.slice(2);
  }

  if (str[0] === '/') {
    return str.slice(1);
  }

  return str;
};

export default function composeFileTree(files: Array<File>) {
  const result: FileTree = [];
    type Level = {
      result: FileTree;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } & Record<string, any>;
    const level: Level = { result };

    files.forEach((file) => {
      const path = stripLeadingSlash(file.file_path);
      const segments = path.split('/');

      segments.reduce((acc, segment, currentIndex, array) => {
        if (!acc[segment]) {
          acc[segment] = { result: [] };
          acc.result.push({
            name: segment,
            ...(currentIndex === array.length - 1 ? file : { children: acc[segment].result }),
          });
        }
        acc.result.sort(sortFileTree);

        return acc[segment];
      }, level);
    });

    return result.sort(sortFileTree);
}
