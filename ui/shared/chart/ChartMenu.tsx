import { useCopyToClipboard } from '@uidotdev/usehooks';
import domToImage from 'dom-to-image';
import React from 'react';

import type { TimeChartItem } from './types';
import type { Resolution } from '@blockscout/stats-types';

import dayjs from 'lib/date/dayjs';
import saveAsCSV from 'lib/saveAsCSV';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { IconButton } from 'toolkit/chakra/icon-button';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from 'toolkit/chakra/menu';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import { isBrowser } from 'toolkit/utils/isBrowser';
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
};

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
  const fullscreenDialog = useDisclosure();

  const [ , copyToClipboard ] = useCopyToClipboard();

  const isInBrowser = isBrowser();

  const showChartFullscreen = React.useCallback(() => {
    fullscreenDialog.onOpenChange({ open: true });
  }, [ fullscreenDialog ]);

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

  const handleCopy = React.useCallback(() => {
    copyToClipboard(chartUrl ?? '');
  }, [ chartUrl, copyToClipboard ]);

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
      <MenuRoot>
        <MenuTrigger asChild>
          <IconButton variant="icon_secondary" size="md" aria-label="Open chart options menu" loadingSkeleton={ isLoading }>
            <IconSvg name="dots"/>
          </IconButton>
        </MenuTrigger>
        <MenuContent>
          { chartUrl && (
            <MenuItem
              value={ hasShare ? 'share' : 'copy' }
              onClick={ hasShare ? handleShare : handleCopy }
              closeOnSelect={ hasShare ? false : true }
            >
              <IconSvg name={ hasShare ? 'share' : 'copy' } boxSize={ 5 }/>
              { hasShare ? 'Share' : 'Copy link' }
            </MenuItem>
          ) }
          <MenuItem
            value="fullscreen"
            onClick={ showChartFullscreen }
          >
            <IconSvg name="scope" boxSize={ 5 }/>
            View fullscreen
          </MenuItem>
          <MenuItem
            value="save-png"
            onClick={ handleFileSaveClick }
          >
            <IconSvg name="files/image" boxSize={ 5 }/>
            Save as PNG
          </MenuItem>
          <MenuItem
            value="save-csv"
            onClick={ handleSVGSavingClick }
          >
            <IconSvg name="files/csv" boxSize={ 5 }/>
            Save as CSV
          </MenuItem>
        </MenuContent>
      </MenuRoot>
      { items && (
        <FullscreenChartModal
          open={ fullscreenDialog.open }
          onOpenChange={ fullscreenDialog.onOpenChange }
          items={ items }
          title={ title }
          description={ description }
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
