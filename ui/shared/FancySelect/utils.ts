import type { Size, ChakraStylesConfig } from 'chakra-react-select';

import type { Option } from './types';

function getValueContainerStyles(size?: Size) {
  switch (size) {
    case 'sm':
    case 'md': {
      return {
        paddingLeft: 4,
      };
    }
    case 'lg': {
      return {
        paddingLeft: 6,
      };
    }
    default: {
      return {};
    }
  }
}

function getSingleValueStyles(size?: Size) {
  switch (size) {
    case 'sm':
    case 'md': {
      return {
        top: '26px',
      };
    }
    case 'lg': {
      return {
        top: '38px',
      };
    }
    default: {
      return {};
    }
  }
}

const chakraStyles: ChakraStylesConfig<Option> = {
//   control: (provided) => ({
//     ...provided,
//   }),
  inputContainer: (provided) => ({
    ...provided,
    py: 0,
    mx: 0,
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    ...getValueContainerStyles(state.selectProps.size),
  }),
  singleValue: (provided, state) => ({
    ...provided,
    mx: 0,
    transform: 'none',
    ...getSingleValueStyles(state.selectProps.size),
  }),
};

export { chakraStyles };
