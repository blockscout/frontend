import { popoverAnatomy as parts } from '@chakra-ui/anatomy';
import type { PartsStyleFunction, SystemStyleFunction, SystemStyleObject } from '@chakra-ui/theme-tools';
import { cssVar, mode } from '@chakra-ui/theme-tools';

const $popperBg = cssVar('popper-bg');

const $arrowBg = cssVar('popper-arrow-bg');
const $arrowShadowColor = cssVar('popper-arrow-shadow-color');

const baseStylePopper: SystemStyleObject = {
  zIndex: 10,
};

const baseStyleContent: SystemStyleFunction = (props) => {
  const bg = mode('white', 'gray.900')(props);
  const shadowColor = mode('gray.200', 'whiteAlpha.300')(props);

  return {
    [$popperBg.variable]: `colors.${ bg }`,
    bg: $popperBg.reference,
    [$arrowBg.variable]: $popperBg.reference,
    [$arrowShadowColor.variable]: `colors.${ shadowColor }`,
    width: 'xs',
    border: 'none',
    borderColor: 'inherit',
    borderRadius: 'md',
    boxShadow: '2xl',
    zIndex: 'inherit',
    _focusVisible: {
      outline: 0,
      boxShadow: 'outline',
    },
  };
};

const baseStyleHeader: SystemStyleObject = {
  px: 3,
  py: 2,
  borderBottomWidth: '1px',
};

const baseStyleBody: SystemStyleObject = {
  px: 4,
  py: 4,
};

const baseStyleFooter: SystemStyleObject = {
  px: 3,
  py: 2,
  borderTopWidth: '1px',
};

const baseStyleCloseButton: SystemStyleObject = {
  position: 'absolute',
  borderRadius: 'md',
  top: 1,
  insetEnd: 2,
  padding: 2,
};

const baseStyle: PartsStyleFunction<typeof parts> = (props) => ({
  popper: baseStylePopper,
  content: baseStyleContent(props),
  header: baseStyleHeader,
  body: baseStyleBody,
  footer: baseStyleFooter,
  arrow: {},
  closeButton: baseStyleCloseButton,
});

const Popover = {
  parts: parts.keys,
  baseStyle,
};

export default Popover;
