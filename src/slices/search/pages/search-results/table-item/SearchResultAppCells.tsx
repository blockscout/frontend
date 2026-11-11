// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultCellsProps } from './types';

import { route } from 'src/shared/router/routes';
import highlightText from 'src/shared/texts/highlight-text';

import { useColorMode } from 'src/toolkit/chakra/color-mode';
import { Image } from 'src/toolkit/chakra/image';
import { Link } from 'src/toolkit/chakra/link';
import { TableCell } from 'src/toolkit/chakra/table';

const SearchResultAppCells = ({ data, searchTerm, isLoading, onLinkClick }: SearchResultCellsProps<'app'>) => {
  const { colorMode } = useColorMode();
  const logo = colorMode === 'dark' && data.app.logoDarkMode ? data.app.logoDarkMode : data.app.logo;

  return (
    <>
      <TableCell>
        <Flex alignItems="center">
          <Image
            borderRadius="base"
            boxSize={ 6 }
            mr={ 2 }
            src={ logo }
            alt={ `${ data.app.title } app icon` }
          />
          <Link
            href={ route({ pathname: '/apps/[id]/info', query: { id: data.app.id } }) }
            fontWeight={ 700 }
            wordBreak="break-all"
            loading={ isLoading }
            onClick={ onLinkClick }
          >
            <span dangerouslySetInnerHTML={{ __html: highlightText(data.app.title, searchTerm) }}/>
          </Link>
        </Flex>
      </TableCell>
      <TableCell verticalAlign="middle" colSpan={ 2 }>
        <Text
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          { data.app.description }
        </Text>
      </TableCell>
    </>
  );
};

export default React.memo(SearchResultAppCells);
