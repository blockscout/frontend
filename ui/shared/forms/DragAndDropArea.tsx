import { chakra, Center, useColorModeValue } from '@chakra-ui/react';
import type { DragEvent } from 'react';
import React from 'react';

import { getAllFileEntries, convertFileEntryToFile } from './utils/files';

interface Props {
  children: React.ReactNode;
  onDrop: (files: Array<File>) => void;
  className?: string;
  isDisabled?: boolean;
  fullFilePath?: boolean;
}

const DragAndDropArea = ({ onDrop, children, className, isDisabled, fullFilePath }: Props) => {
  const [ isDragOver, setIsDragOver ] = React.useState(false);

  const handleDrop = React.useCallback(async(event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (isDisabled) {
      return;
    }

    const fileEntries = await getAllFileEntries(event.dataTransfer.items);
    const files = await Promise.all(fileEntries.map((fileEntry) => convertFileEntryToFile(fileEntry, fullFilePath)));

    onDrop(files);
    setIsDragOver(false);
  }, [ isDisabled, onDrop, fullFilePath ]);

  const handleDragOver = React.useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDragEnter = React.useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = React.useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = React.useCallback((event: React.MouseEvent) => {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, [ isDisabled ]);

  const disabledBorderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const borderColor = isDragOver ? 'link_hovered' : 'link';

  return (
    <Center
      className={ className }
      w="100%"
      minH="120px"
      borderWidth="2px"
      borderColor={ isDisabled ? disabledBorderColor : borderColor }
      _hover={{
        borderColor: isDisabled ? disabledBorderColor : 'link_hovered',
      }}
      borderRadius="base"
      borderStyle="dashed"
      cursor="pointer"
      textAlign="center"
      onClick={ handleClick }
      onDrop={ handleDrop }
      onDragOver={ handleDragOver }
      onDragEnter={ handleDragEnter }
      onDragLeave={ handleDragLeave }
    >
      { children }
    </Center>
  );
};

export default React.memo(chakra(DragAndDropArea));
