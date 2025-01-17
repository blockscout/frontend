import type { ThemingConfig } from '@chakra-ui/react';

import type { ExcludeUndefined } from 'types/utils';

const colors: ExcludeUndefined<ThemingConfig['tokens']>['colors'] = {
  green: {
    '100': { value: '#C6F6D5' },
    '400': { value: '#48BB78' },
    '500': { value: '#38A169' },
    '600': { value: '#25855A' },
  },
  blue: {
    '50': { value: '#EBF8FF' },
    '100': { value: '#BEE3F8' },
    '200': { value: '#90CDF4' },
    '300': { value: '#63B3ED' },
    '400': { value: '#4299E1' },
    '500': { value: '#3182CE' },
    '600': { value: '#2B6CB0' },
    '700': { value: '#2C5282' },
    '800': { value: '#2A4365' },
    '900': { value: '#1A365D' },
  },
  red: {
    '500': { value: '#E53E3E' },
    '100': { value: '#FED7D7' },
  },
  orange: {
    '100': { value: '#FEEBCB' },
  },
  gray: {
    '50': { value: '#F7FAFC' },
    '100': { value: '#EDF2F7' },
    '200': { value: '#E2E8F0' },
    '300': { value: '#CBD5E0' },
    '400': { value: '#A0AEC0' },
    '500': { value: '#718096' },
    '600': { value: '#4A5568' },
    '700': { value: '#2D3748' },
    '800': { value: '#1A202C' },
    '900': { value: '#171923' },
  },
  black: { value: '#101112' },
  white: { value: '#ffffff' },
  blackAlpha: {
    '50': { value: 'RGBA(16, 17, 18, 0.04)' },
    '100': { value: 'RGBA(16, 17, 18, 0.06)' },
    '200': { value: 'RGBA(16, 17, 18, 0.08)' },
    '300': { value: 'RGBA(16, 17, 18, 0.16)' },
    '400': { value: 'RGBA(16, 17, 18, 0.24)' },
    '500': { value: 'RGBA(16, 17, 18, 0.36)' },
    '600': { value: 'RGBA(16, 17, 18, 0.48)' },
    '700': { value: 'RGBA(16, 17, 18, 0.64)' },
    '800': { value: 'RGBA(16, 17, 18, 0.80)' },
    '900': { value: 'RGBA(16, 17, 18, 0.92)' },
  },
  github: { value: '#171923' },
  telegram: { value: '#2775CA' },
  linkedin: { value: '#1564BA' },
  discord: { value: '#9747FF' },
  slack: { value: '#1BA27A' },
  twitter: { value: '#000000' },
  opensea: { value: '#2081E2' },
  facebook: { value: '#4460A0' },
  medium: { value: '#231F20' },
  reddit: { value: '#FF4500' },
  celo: { value: '#FCFF52' },
};

export default colors;
