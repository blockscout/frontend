import {
  Button,
  PopoverTrigger,
  PopoverBody,
  PopoverContent,
  Show,
  Hide,
  chakra,
  useDisclosure,
  Grid,
} from '@chakra-ui/react';
import React from 'react';

import Popover from 'ui/shared/chakra/Popover';
import IconSvg from 'ui/shared/IconSvg';
import PopoverTriggerTooltip from 'ui/shared/PopoverTriggerTooltip';

interface Props {
  className?: string;
  links: Array<React.ReactNode>;
  label: string;
  longText: string;
  shortText?: string;
}

const VerifyWith = ({ className, links, label, longText, shortText }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <PopoverTriggerTooltip label={ label } className={ className }>
          <Button
            size="sm"
            variant="outline"
            colorScheme="gray"
            onClick={ onToggle }
            isActive={ isOpen }
            aria-label={ label }
            fontWeight={ 500 }
            px={ shortText ? 2 : 1 }
            h="32px"
            flexShrink={ 0 }
          >
            <IconSvg name="explorer" boxSize={ 5 }/>
            <Show above="xl">
              <chakra.span ml={ 1 }>{ longText }</chakra.span>
            </Show>
            { shortText && (
              <Hide above="xl">
                <chakra.span ml={ 1 }>{ shortText }</chakra.span>
              </Hide>
            ) }
          </Button>
        </PopoverTriggerTooltip>
      </PopoverTrigger>
      <PopoverContent w="auto">
        <PopoverBody >
          <chakra.span color="text_secondary" fontSize="xs">{ label }</chakra.span>
          <Grid
            alignItems="center"
            templateColumns={ links.length > 1 ? 'auto auto' : '1fr' }
            columnGap={ 4 }
            rowGap={ 2 }
            mt={ 3 }
          >
            { links }
          </Grid>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default chakra(VerifyWith);
