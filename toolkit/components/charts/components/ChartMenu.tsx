import { Icon } from '@chakra-ui/react';
import { useCopyToClipboard } from '@uidotdev/usehooks';
import domToImage from 'dom-to-image';
import React from 'react';

import CopyIcon from 'icons/copy.svg';
import DotsIcon from 'icons/dots.svg';
import CsvIcon from 'icons/files/csv.svg';
import ImageIcon from 'icons/files/image.svg';
import ScopeIcon from 'icons/scope.svg';
import ShareIcon from 'icons/share.svg';
import { useMultichainContext } from 'lib/contexts/multichain';

import { useColorModeValue } from '../../../chakra/color-mode';
import { IconButton } from '../../../chakra/icon-button';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '../../../chakra/menu';
import { saveAsCsv } from '../../../utils/file';
import { isBrowser } from '../../../utils/isBrowser';

export const CHART_MENU_ITEMS_IDS = [
  'share' as const,
  'fullscreen' as const,
  'save_png' as const,
  'save_csv' as const,
];

const DOWNLOAD_IMAGE_SCALE = 5;

export type ChartMenuItemId = (typeof CHART_MENU_ITEMS_IDS)[number];

export interface ChartMenuProps {
  title: string;
  description?: string;
  items?: Array<ChartMenuItemId>;
  csvData: Array<Array<string>>;
  chartUrl?: string;
  isLoading: boolean;
  chartRef: React.RefObject<HTMLDivElement | null>;
  onShare?: () => void;
  onFullscreenOpen?: () => void;
}

export const ChartMenu = ({
  title,
  description,
  items = CHART_MENU_ITEMS_IDS,
  csvData,
  chartUrl,
  isLoading,
  chartRef,
  onShare,
  onFullscreenOpen,
}: ChartMenuProps) => {

  const [ , copyToClipboard ] = useCopyToClipboard();
  const pngBackgroundColor = useColorModeValue('white', 'black');
  const multichainContext = useMultichainContext();

  const chainPostfix = React.useMemo(() => {
    return multichainContext?.chain.name ? ` on ${ multichainContext.chain.name }` : '';
  }, [ multichainContext?.chain.name ]);

  // TS thinks window.navigator.share can't be undefined, but it can
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const canShare = isBrowser() && (window.navigator.share as any);

  const handleCopy = React.useCallback(() => {
    copyToClipboard(chartUrl ?? '');
    onShare?.();
  }, [ chartUrl, copyToClipboard, onShare ]);

  const handleShare = React.useCallback(async() => {
    try {
      await window.navigator.share({
        title: title,
        text: description,
        url: chartUrl,
      });
      onShare?.();
    } catch (error) {}
  }, [ title, description, chartUrl, onShare ]);

  const handleSavePngClick = React.useCallback(() => {
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
            link.download = `${ title }${ chainPostfix } (Blockscout chart).png`;
            link.href = dataUrl;
            link.click();
            link.remove();
          });
      }
    }, 100);
  }, [ pngBackgroundColor, title, chainPostfix, chartRef ]);

  const handleSaveCsvClick = React.useCallback(() => {
    saveAsCsv(csvData, `${ title }${ chainPostfix } (Blockscout stats)`);
  }, [ csvData, title, chainPostfix ]);

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <IconButton variant="icon_background" size="md" aria-label="Open chart options menu" loadingSkeleton={ isLoading }>
          <Icon><DotsIcon/></Icon>
        </IconButton>
      </MenuTrigger>
      <MenuContent>
        { items.includes('share') && chartUrl && (
          <MenuItem
            value={ canShare ? 'share' : 'copy' }
            onClick={ canShare ? handleShare : handleCopy }
            closeOnSelect={ canShare ? false : true }
          >
            <Icon boxSize={ 5 }>{ canShare ? <ShareIcon/> : <CopyIcon/> }</Icon>
            { canShare ? 'Share' : 'Copy link' }
          </MenuItem>
        ) }
        { items.includes('fullscreen') && onFullscreenOpen && (
          <MenuItem
            value="fullscreen"
            onClick={ onFullscreenOpen }
          >
            <Icon boxSize={ 5 }><ScopeIcon/></Icon>
            View fullscreen
          </MenuItem>
        ) }
        { items.includes('save_png') && (
          <MenuItem
            value="save-png"
            onClick={ handleSavePngClick }
          >
            <Icon boxSize={ 5 }><ImageIcon/></Icon>
            Save as PNG
          </MenuItem>
        ) }
        { items.includes('save_csv') && csvData && (
          <MenuItem
            value="save-csv"
            onClick={ handleSaveCsvClick }
          >
            <Icon boxSize={ 5 }><CsvIcon/></Icon>
            Save as CSV
          </MenuItem>
        ) }
      </MenuContent>
    </MenuRoot>
  );
};
