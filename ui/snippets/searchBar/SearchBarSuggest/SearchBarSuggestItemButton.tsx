import { useColorModeValue, Box } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { MarketplaceAppOverview } from 'types/client/marketplace';
type Props = {
  data: MarketplaceAppOverview;
  children: React.ReactNode;
  handleData: (data: MarketplaceAppOverview) => void;
};

const SearchBarSuggestItemButton = ({ data, children, handleData }: Props) => {
  const handleClick = useCallback(() => {
    handleData(data);
  }, [ data, handleData ]);

  const hoverBgColor = useColorModeValue('blue.50', 'gray.800');

  return (
    <Box
      py={ 3 }
      px={ 1 }
      display="flex"
      flexDir="column"
      rowGap={ 2 }
      borderColor="divider"
      borderBottomWidth="1px"
      cursor="pointer"
      _last={{
        borderBottomWidth: '0',
      }}
      _hover={{
        bgColor: hoverBgColor,
      }}
      fontSize="sm"
      _first={{
        mt: 2,
      }}
      className="cursor-pointer"
      onClick={ handleClick }
    >
      { children }
    </Box>
  );
};

export default SearchBarSuggestItemButton;
