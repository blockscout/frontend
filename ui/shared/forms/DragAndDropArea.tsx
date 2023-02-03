import { Box } from '@chakra-ui/react';
import type { DragEvent } from 'react';
import React from 'react';

import { getAllFileEntries, convertFileEntryToFile } from './utils/files';

interface Props {
  onDrop: (files: Array<File>) => void;
}

const DragAndDropArea = ({ onDrop }: Props) => {
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
    <Box
      w="100%"
      h="200px"
      bgColor="lightpink"
      opacity={ isDragOver ? 0.8 : 1 }
      onDrop={ handleDrop }
      onDragOver={ handleDragOver }
      onDragEnter={ handleDragEnter }
      onDragLeave={ handleDragLeave }
    />
  );
};

export default React.memo(DragAndDropArea);
