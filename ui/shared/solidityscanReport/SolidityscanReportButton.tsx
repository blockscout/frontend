import {
  Button,
  chakra,
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverContent,
  useDisclosure,
  Skeleton,
} from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

import useScoreLevelAndColor from './useScoreLevelAndColor';

interface Props {
  className?: string;
  score: number;
  popoverContent?: React.ReactNode;
  isLoading?: boolean;
}

const SolidityscanReportButton = ({ className, score, popoverContent, isLoading }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { scoreColor } = useScoreLevelAndColor(score);

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <Skeleton isLoaded={ !isLoading } borderRadius="base">
          <Button
            className={ className }
            color={ scoreColor }
            size="sm"
            variant="outline"
            colorScheme="gray"
            onClick={ onToggle }
            aria-label="SolidityScan score"
            fontWeight={ 500 }
            px="6px"
            h="32px"
            flexShrink={ 0 }
          >
            <IconSvg name={ score < 80 ? 'score/score-not-ok' : 'score/score-ok' } boxSize={ 5 } mr={ 1 }/>
            { score }
          </Button>
        </Skeleton>
      </PopoverTrigger>
      <PopoverContent w={{ base: '100vw', lg: '328px' }}>
        <PopoverBody px="26px" py="20px" fontSize="sm">
          { popoverContent }
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default chakra(SolidityscanReportButton);
