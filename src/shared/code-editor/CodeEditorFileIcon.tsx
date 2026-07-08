// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { IconName } from 'src/sprite/SpriteIcon';
import SpriteIcon from 'src/sprite/SpriteIcon';

interface Props {
  className?: string;
  fileName: string;
}

const CodeEditorFileIcon = ({ className, fileName }: Props) => {
  const name: IconName = (() => {
    if (/\.vyi?$/.test(fileName)) {
      return 'monaco/vyper';
    }

    if (/.sol|.yul$/.test(fileName)) {
      return 'monaco/solidity';
    }

    if (/.rs$/.test(fileName)) {
      return 'monaco/rust';
    }

    if (/^Cargo\./.test(fileName)) {
      return 'monaco/cargo';
    }

    if (/.toml$/.test(fileName)) {
      return 'monaco/toml';
    }

    return 'monaco/file';
  })();

  return <SpriteIcon className={ className } name={ name } boxSize="16px"/>;
};

export default React.memo(chakra(CodeEditorFileIcon));
