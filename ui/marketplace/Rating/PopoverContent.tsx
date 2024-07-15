import { Text, Flex, Spinner, Button } from '@chakra-ui/react';
import React from 'react';

import { mdash } from 'lib/html-entities';
import type { EventTypes, EventPayload } from 'lib/mixpanel/index';
import IconSvg from 'ui/shared/IconSvg';

import Stars from './Stars';

const ratingDescriptions = [ 'Terrible', 'Poor', 'Average', 'Very good', 'Outstanding' ];

type Props = {
  appId: string;
  recordId?: string;
  userRating: number | undefined;
  rate: (appId: string, recordId: string | undefined, rating: number, source: EventPayload<EventTypes.APP_FEEDBACK>['Source']) => void;
  isSending?: boolean;
  source: EventPayload<EventTypes.APP_FEEDBACK>['Source'];
};

const PopoverContent = ({ appId, recordId, userRating, rate, isSending, source }: Props) => {
  const [ hovered, setHovered ] = React.useState(-1);
  const [ selected, setSelected ] = React.useState(-1);

  const handleMouseOverFactory = React.useCallback((index: number) => () => {
    setHovered(index);
  }, []);

  const handleSelectFactory = React.useCallback((index: number) => () => {
    setSelected(index);
  }, []);

  const handleMouseOut = React.useCallback(() => {
    setHovered(-1);
  }, []);

  const handleRate = React.useCallback(() => {
    if (selected < 0) {
      return;
    }
    rate(appId, recordId, selected + 1, source);
  }, [ appId, recordId, selected, rate, source ]);

  if (userRating) {
    return (
      <>
        <Flex alignItems="center">
          <IconSvg
            name="verified"
            color="green.400"
            boxSize="30px"
            mr={ 1 }
            ml="-5px"
          />
          <Text fontWeight="500" fontSize="xs" lineHeight="30px" variant="secondary">
            App is already rated by you
          </Text>
        </Flex>
        <Flex alignItems="center" h="32px">
          <IconSvg
            name="star_filled"
            color="yellow.400"
            boxSize={ 5 }
            mr={ 1 }
          />
          <Text fontSize="md" fontWeight="500" mr={ 3 }>
            { userRating.toFixed(1) }
          </Text>
          <Text fontSize="md">
            { mdash } { ratingDescriptions[ userRating - 1 ] }
          </Text>
        </Flex>
      </>
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
          filledIndex={ hovered >= 0 ? hovered : selected }
          onMouseOverFactory={ handleMouseOverFactory }
          onMouseOut={ handleMouseOut }
          onClickFactory={ handleSelectFactory }
        />
        { (hovered >= 0 || selected >= 0) && (
          <Text fontSize="md" ml={ 2 }>
            { ratingDescriptions[ hovered >= 0 ? hovered : selected ] }
          </Text>
        ) }
      </Flex>
      <Button size="sm" px={ 4 } mt={ 3 } onClick={ handleRate } isDisabled={ selected < 0 }>
        Rate it
      </Button>
    </>
  );
};

export default PopoverContent;
