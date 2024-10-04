import { TagLabel, Tooltip } from '@chakra-ui/react';
import React from 'react';

import Tag from 'ui/shared/chakra/Tag';
import IconSvg from 'ui/shared/IconSvg';

const WvmArchiverTag = () => {

  return (
    <Tooltip>
      <Tag
        color="#fff"
        backgroundColor="#52224D"
        display="flex"
        padding="2px 5px"
      >
        <IconSvg name="gear_slim" boxSize={ 2.5 } mr={ 1 } flexShrink={ 0 }/>
        <TagLabel display="block">wvm-archiver</TagLabel>
      </Tag>
    </Tooltip>
  );
};

export default WvmArchiverTag;
