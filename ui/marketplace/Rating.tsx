import {
  Text, Popover, PopoverTrigger, PopoverBody, PopoverContent, useDisclosure,
  Button, Flex, Spinner, Skeleton, chakra, useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import type { MouseEventHandler } from 'react';

import IconSvg from 'ui/shared/IconSvg';

const ratingDescriptions = [ 'Terrible', 'Poor', 'Average', 'Very good', 'Outstanding' ];

type StarsProps = {
  filledIndex: number;
  onMouseOverFactory?: (index: number) => MouseEventHandler<HTMLDivElement>;
  onMouseOut?: () => void;
  onClickFactory?: (index: number) => MouseEventHandler<HTMLDivElement>;
};

const Stars = ({ filledIndex, onMouseOverFactory, onMouseOut, onClickFactory }: StarsProps) => (
  <>
    { Array(5).fill(null).map((_, index) => (
      <IconSvg
        key={ index }
        name={ filledIndex >= index ? 'star_filled' : 'star_outline' }
        color={ filledIndex >= index ? 'yellow.400' : 'gray.400' }
        w={ 6 } // 5 + 1 padding
        h={ 5 }
        pr={ 1 } // use padding intead of margin so that there are no empty spaces between stars without hover effect
        cursor={ onMouseOverFactory ? 'pointer' : 'default' }
        onMouseOver={ onMouseOverFactory?.(index) }
        onMouseOut={ onMouseOut }
        onClick={ onClickFactory?.(index) }
      />
    )) }
  </>
);

type ContentProps = {
  appId: string;
  recordId?: string;
  isRatedByUser?: boolean;
  rate: (appId: string, recordId: string | undefined, rating: number) => void;
  isSending?: boolean;
};

const Content = ({ appId, recordId, isRatedByUser, rate, isSending }: ContentProps) => {
  const [ hovered, setHovered ] = React.useState(-1);

  const handleMouseOverFactory = React.useCallback((index: number) => () => {
    setHovered(index);
  }, []);

  const handleMouseOut = React.useCallback(() => {
    setHovered(-1);
  }, []);

  const handleRateFactory = React.useCallback((index: number) => () => {
    rate(appId, recordId, index + 1);
  }, [ appId, recordId, rate ]);

  if (isRatedByUser) {
    return (
      <Flex alignItems="center">
        <IconSvg name="check_circle" color="green.500" boxSize={ 8 }/>
        <Text fontSize="md" ml={ 3 }>App is already rated</Text>
      </Flex>
    );
  }

  if (isSending) {
    return (
      <Flex alignItems="center">
        <Spinner size="md"/>
        <Text fontSize="md" ml={ 3 }>Sending your feedback</Text>
      </Flex>
    );
  }

  return (
    <>
      <Text fontWeight="500" fontSize="xs" lineHeight="30px" variant="secondary">
        How was your experience?
      </Text>
      <Flex alignItems="center" h="32px">
        <Stars
          filledIndex={ hovered }
          onMouseOverFactory={ handleMouseOverFactory }
          onMouseOut={ handleMouseOut }
          onClickFactory={ handleRateFactory }
        />
        { hovered >= 0 && (
          <Text fontSize="md" ml={ 2 }>
            { ratingDescriptions[ hovered ] }
          </Text>
        ) }
      </Flex>
    </>
  );
};

type RatingProps = {
  appId: string;
  rating?: number;
  recordId?: string;
  isRatedByUser?: boolean;
  rate: (appId: string, recordId: string | undefined, rating: number) => void;
  isSending?: boolean;
  isLoading?: boolean;
  fullView?: boolean;
};

const Rating = ({ appId, rating, recordId, isRatedByUser, rate, isSending, isLoading, fullView }: RatingProps) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const textColor = useColorModeValue('blackAlpha.800', 'whiteAlpha.800');

  return (
    <Skeleton display="flex" alignItems="center" isLoaded={ !isLoading } minW={ isLoading ? '40px' : 'auto' }>
      { fullView && (
        <>
          <Stars filledIndex={ (rating || 0) - 1 }/>
          <Text fontSize="md" ml={ 1 }>{ rating }</Text>
        </>
      ) }
      <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom" isLazy>
        <PopoverTrigger>
          { fullView ? (
            <Button
              size="sx"
              variant="outline"
              border={ 0 }
              p={ 0 }
              onClick={ onToggle }
              fontSize="md"
              fontWeight="400"
              ml={ 3 }
            >
              Rate it!
            </Button>
          ) : (
            <Button
              size="xs"
              variant="outline"
              border={ 0 }
              p={ 0 }
              onClick={ onToggle }
              fontSize="sm"
              fontWeight="500"
              lineHeight="21px"
              isActive={ isOpen }
            >
              <IconSvg
                name={ rating ? 'star_filled' : 'star_outline' }
                color={ rating ? 'yellow.400' : 'gray.400' }
                boxSize={ 5 }
                mr={ 1 }
              />
              { rating ? (
                <chakra.span color={ textColor } transition="inherit">{ rating }</chakra.span>
              ) : (
                'Rate it!'
              ) }
            </Button>
          ) }
        </PopoverTrigger>
        <PopoverContent w="274px">
          <PopoverBody p={ 4 }>
            <Content
              appId={ appId }
              recordId={ recordId }
              isRatedByUser={ isRatedByUser }
              rate={ rate }
              isSending={ isSending }
            />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Skeleton>
  );
};

export default Rating;
