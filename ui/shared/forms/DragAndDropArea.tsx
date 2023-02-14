import { chakra, Center } from '@chakra-ui/react';
import type { DragEvent } from 'react';
import React from 'react';

import { getAllFileEntries, convertFileEntryToFile } from './utils/files';

interface Props {
  children: React.ReactNode;
  onDrop: (files: Array<File>) => void;
  className?: string;
}

const DragAndDropArea = ({ onDrop, children, className }: Props) => {
  const [ isDragOver, setIsDragOver ] = React.useState(false);

  const handleDrop = React.useCallback(async(event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const fileEntries = await getAllFileEntries(event.dataTransfer.items);
    const files = await Promise.all(fileEntries.map(convertFileEntryToFile));

    onDrop(files);
    setIsDragOver(false);
  }, [ onDrop ]);

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

  return (
    <Center
      className={ className }
      w="100%"
      minH="120px"
      borderWidth="2px"
      borderColor={ isDragOver ? 'link_hovered' : 'link' }
      _hover={{
        borderColor: 'link_hovered',
      }}
      borderRadius="base"
      borderStyle="dashed"
      cursor="pointer"
      textAlign="center"
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
