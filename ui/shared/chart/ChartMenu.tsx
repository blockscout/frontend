import {
  IconButton,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  useClipboard,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import domToImage from 'dom-to-image';
import React from 'react';

import type { TimeChartItem } from './types';
import type { Resolution } from '@blockscout/stats-types';

import dayjs from 'lib/date/dayjs';
import isBrowser from 'lib/isBrowser';
import saveAsCSV from 'lib/saveAsCSV';
import Menu from 'ui/shared/chakra/Menu';
import IconSvg from 'ui/shared/IconSvg';

import FullscreenChartModal from './FullscreenChartModal';

export type Props = {
  items?: Array<TimeChartItem>;
  title: string;
  description?: string;
  units?: string;
  isLoading: boolean;
  chartRef: React.RefObject<HTMLDivElement>;
  chartUrl?: string;
  resolution?: Resolution;
  zoomRange?: [ Date, Date ];
  handleZoom: (range: [ Date, Date ]) => void;
  handleZoomReset: () => void;
}

const DOWNLOAD_IMAGE_SCALE = 5;

const ChartMenu = ({
  items,
  title,
  description,
  units,
  isLoading,
  chartRef,
  chartUrl,
  resolution,
  zoomRange,
  handleZoom,
  handleZoomReset,
}: Props) => {
  const pngBackgroundColor = useColorModeValue('white', 'black');
  const [ isFullscreen, setIsFullscreen ] = React.useState(false);

  const { onCopy } = useClipboard(chartUrl ?? '');

  const isInBrowser = isBrowser();

  const showChartFullscreen = React.useCallback(() => {
    setIsFullscreen(true);
  }, []);

  const clearFullscreenChart = React.useCallback(() => {
    setIsFullscreen(false);
  }, []);

  const handleFileSaveClick = React.useCallback(() => {
    // wait for context menu to close
    setTimeout(() => {
      if (chartRef.current) {
        domToImage.toPng(chartRef.current,
          {
            quality: 100,
            bgcolor: pngBackgroundColor,
            width: chartRef.current.offsetWidth * DOWNLOAD_IMAGE_SCALE,
            height: chartRef.current.offsetHeight * DOWNLOAD_IMAGE_SCALE,
            filter: (node) => node.nodeName !== 'BUTTON',
            style: {
              borderColor: 'transparent',
              transform: `scale(${ DOWNLOAD_IMAGE_SCALE })`,
              'transform-origin': 'top left',
            },
          })
          .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = `${ title } (Blockscout chart).png`;
            link.href = dataUrl;
            link.click();
            link.remove();
          });
      }
    }, 100);
  }, [ pngBackgroundColor, title, chartRef ]);

  const handleSVGSavingClick = React.useCallback(() => {
    if (items) {
      const headerRows = [
        'Date', 'Value',
      ];
      const dataRows = items.map((item) => [
        dayjs(item.date).format('YYYY-MM-DD'), String(item.value),
      ]);

      saveAsCSV(headerRows, dataRows, `${ title } (Blockscout stats)`);
    }
  }, [ items, title ]);

  // TS thinks window.navigator.share can't be undefined, but it can
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasShare = isInBrowser && (window.navigator.share as any);

  const handleShare = React.useCallback(async() => {
    try {
      await window.navigator.share({
        title: title,
        text: description,
        url: chartUrl,
      });
    } catch (error) {}
  }, [ title, description, chartUrl ]);

  return (
    <>
      <Menu>
        <Skeleton isLoaded={ !isLoading } borderRadius="base">
          <MenuButton
            w="36px"
            h="32px"
            icon={ <IconSvg name="dots" boxSize={ 4 } transform="rotate(-90deg)"/> }
            colorScheme="gray"
            variant="simple"
            as={ IconButton }
          >
            <VisuallyHidden>
            Open chart options menu
            </VisuallyHidden>
          </MenuButton>
        </Skeleton>
        <MenuList>
          { chartUrl && (
            <MenuItem
              display="flex"
              alignItems="center"
              onClick={ hasShare ? handleShare : onCopy }
              closeOnSelect={ hasShare ? false : true }
            >
              <IconSvg name={ hasShare ? 'share' : 'copy' } boxSize={ 5 } mr={ 3 }/>
              { hasShare ? 'Share' : 'Copy link' }
            </MenuItem>
          ) }
          <MenuItem
            display="flex"
            alignItems="center"
            onClick={ showChartFullscreen }
          >
            <IconSvg name="scope" boxSize={ 5 } mr={ 3 }/>
            View fullscreen
          </MenuItem>
          <MenuItem
            display="flex"
            alignItems="center"
            onClick={ handleFileSaveClick }
          >
            <IconSvg name="files/image" boxSize={ 5 } mr={ 3 }/>
            Save as PNG
          </MenuItem>
          <MenuItem
            display="flex"
            alignItems="center"
            onClick={ handleSVGSavingClick }
          >
            <IconSvg name="files/csv" boxSize={ 5 } mr={ 3 }/>
            Save as CSV
          </MenuItem>
        </MenuList>
      </Menu>
      { items && isFullscreen && (
        <FullscreenChartModal
          isOpen
          items={ items }
          title={ title }
          description={ description }
          onClose={ clearFullscreenChart }
          units={ units }
          resolution={ resolution }
          zoomRange={ zoomRange }
          handleZoom={ handleZoom }
          handleZoomReset={ handleZoomReset }
        />
      ) }
    </>
  );
};

export default ChartMenu;
