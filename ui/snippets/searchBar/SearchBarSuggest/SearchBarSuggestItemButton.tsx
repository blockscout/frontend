import { chakra, useColorModeValue,Box } from '@chakra-ui/react';
import React from 'react';
import { MarketplaceAppOverview } from 'types/client/marketplace';
type Props = {
  data: any;
  children: React.ReactNode;
  handleData: (data: MarketplaceAppOverview) => void;
};

const SearchBarSuggestItemButton = ({ data, children,handleData }: Props) => {
    const handleClick = () => {
        handleData(data);
      };
    return(
      <Box
      py={3}
      px={1}
      display="flex"
      flexDir="column"
      rowGap={2}
      borderColor="divider"
      borderBottomWidth="1px"
      cursor="pointer" 
      _last={{
        borderBottomWidth: '0',
      }}
      _hover={{
        bgColor: useColorModeValue('blue.50', 'gray.800'),
      }}
      fontSize="sm"
      _first={{
        mt: 2,
      }}
      className="cursor-pointer"
      onClick={handleClick}
    >
      {children}
    </Box>
    )
};

export default SearchBarSuggestItemButton;
