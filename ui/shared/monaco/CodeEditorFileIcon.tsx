import { Icon, chakra } from '@chakra-ui/react';
import React from 'react';

import iconFile from './icons/file.svg';
import iconSolidity from './icons/solidity.svg';
import iconVyper from './icons/vyper.svg';

interface Props {
  className?: string;
  fileName: string;
}

const CodeEditorFileIcon = ({ className, fileName }: Props) => {
  const as = (() => {
    if (/.vy$/.test(fileName)) {
      return iconVyper;
    }

    if (/.sol|.yul$/.test(fileName)) {
      return iconSolidity;
    }

    return iconFile;
  })();

  return <Icon className={ className } as={ as } boxSize="16px"/>;
};

export default React.memo(chakra(CodeEditorFileIcon));
