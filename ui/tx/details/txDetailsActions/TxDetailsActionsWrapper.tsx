import { Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import DetailsInfoItem from 'ui/shared/DetailsInfoItem';

const SCROLL_GRADIENT_HEIGHT = 48;

type Props = {
  children: React.ReactNode;
  isLoading?: boolean;
}

export const TX_ACTIONS_BLOCK_ID = 'tx-actions';

const TxDetailsActions = ({ children, isLoading }: Props) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [ hasScroll, setHasScroll ] = React.useState(false);

  const gradientStartColor = useColorModeValue('whiteAlpha.600', 'blackAlpha.600');
  const gradientEndColor = useColorModeValue('whiteAlpha.900', 'blackAlpha.900');

  React.useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    setHasScroll(containerRef.current.scrollHeight >= containerRef.current.clientHeight + SCROLL_GRADIENT_HEIGHT / 2);
  }, []);

  return (
    <DetailsInfoItem
      title="Transaction action"
      hint="Highlighted events of the transaction"
      note={ hasScroll ? 'Scroll to see more' : undefined }
      position="relative"
      isLoading={ isLoading }
    >
      <Flex
        id={ TX_ACTIONS_BLOCK_ID }
        flexDirection="column"
        alignItems="stretch"
        rowGap={ 5 }
        w="100%"
        maxH="200px"
        overflowY="scroll"
        ref={ containerRef }
        _after={ hasScroll ? {
          position: 'absolute',
          content: '""',
          bottom: 0,
          left: 0,
          right: '20px',
          height: `${ SCROLL_GRADIENT_HEIGHT }px`,
          bgGradient: `linear(to-b, ${ gradientStartColor } 37.5%, ${ gradientEndColor } 77.5%)`,
        } : undefined }
        pr={ hasScroll ? 5 : 0 }
        pb={ hasScroll ? 10 : 0 }
      >
        { children }
      </Flex>
    </DetailsInfoItem>
  );
};

export default React.memo(TxDetailsActions);
