import { Alert as ChakraAlert } from '@chakra-ui/react';
import * as React from 'react';

import IconSvg from 'ui/shared/IconSvg';

import { CloseButton } from './close-button';
import { Skeleton } from './skeleton';

export interface AlertProps extends Omit<ChakraAlert.RootProps, 'title'> {
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
  title?: React.ReactNode;
  icon?: React.ReactElement;
  closable?: boolean;
  onClose?: () => void;
  loading?: boolean;
  showIcon?: boolean;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    const {
      title,
      children,
      icon,
      closable,
      onClose,
      startElement,
      endElement,
      loading,
      showIcon = false,
      ...rest
    } = props;

    const defaultIcon = <IconSvg name="info_filled" w="100%" h="100%"/>;

    const iconElement = (() => {
      if (startElement !== undefined) {
        return startElement;
      }

      if (!showIcon && icon === undefined) {
        return null;
      }

      return <ChakraAlert.Indicator>{ icon || defaultIcon }</ChakraAlert.Indicator>;
    })();

    return (
      <Skeleton loading={ loading } asChild>
        <ChakraAlert.Root ref={ ref } { ...rest }>
          { iconElement }
          { children ? (
            <ChakraAlert.Content>
              { title && <ChakraAlert.Title>{ title }</ChakraAlert.Title> }
              <ChakraAlert.Description display="inline-flex">{ children }</ChakraAlert.Description>
            </ChakraAlert.Content>
          ) : (
            <ChakraAlert.Title flex="1">{ title }</ChakraAlert.Title>
          ) }
          { endElement }
          { closable && (
            <CloseButton
              pos="relative"
              top="-2"
              insetEnd="-2"
              alignSelf="flex-start"
              onClick={ onClose }
            />
          ) }
        </ChakraAlert.Root>
      </Skeleton>
    );
  },
);
