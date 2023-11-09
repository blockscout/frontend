import {
  IconButton,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useColorMode,
  useColorModeValue,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
} from '@chakra-ui/react';
import React from 'react';

import gearIcon from 'icons/gear.svg';

const COLORS = [
  '#101112',
  '#142639',
  '#193047',
  '#24405c',
];

const ColorModeSlider = () => {
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
  const [ sliderValue, setSliderValue ] = React.useState(0);
  const [ showTooltip, setShowTooltip ] = React.useState(false);

  const handleValueChange = React.useCallback((value: number) => {
    setSliderValue(value);
    const color = COLORS[value - 1];
    window.document.documentElement.style.setProperty('--chakra-colors-black', color);
  }, []);

  const handleMouseEnter = React.useCallback(() => {
    setShowTooltip(true);
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    setShowTooltip(false);
  }, []);

  return (
    <Popover placement="bottom-start" isLazy trigger="click">
      <PopoverTrigger>
        <IconButton
          colorScheme="blue"
          aria-label="hint"
          icon={ <Icon as={ gearIcon } boxSize={ 5 }/> }
          boxSize={ 8 }
          variant="outline"
          isDisabled={ colorMode === 'light' }
        />
      </PopoverTrigger>
      <PopoverContent overflowY="hidden" w="240px">
        <PopoverBody bgColor={ bgColor } h="54px" boxShadow="2xl">
          <Slider
            id="slider"
            defaultValue={ 1 }
            min={ 1 }
            max={ COLORS.length }
            colorScheme="teal"
            onChange={ handleValueChange }
            onMouseEnter={ handleMouseEnter }
            onMouseLeave={ handleMouseLeave }
          >
            <SliderTrack>
              <SliderFilledTrack/>
            </SliderTrack>
            <Tooltip
              hasArrow
              bg="teal.500"
              color="white"
              placement="top"
              isOpen={ showTooltip }
              label={ COLORS[sliderValue - 1] }
            >
              <SliderThumb/>
            </Tooltip>
          </Slider>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ColorModeSlider;
