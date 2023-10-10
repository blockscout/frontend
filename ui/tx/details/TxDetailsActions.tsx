import { Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { TxAction } from 'types/api/txAction';

import DetailsInfoItem from 'ui/shared/DetailsInfoItem';

import TxDetailsAction from './TxDetailsAction';

const SCROLL_GRADIENT_HEIGHT = 48;

interface Props {
  actions: Array<TxAction>;
}

const TxDetailsActions = ({ actions }: Props) => {
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
    >
      <Flex
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
        { actions.map((action, index: number) => <TxDetailsAction key={ index } action={ action }/>) }
      </Flex>
    </DetailsInfoItem>
  );
};

export default React.memo(TxDetailsActions);
