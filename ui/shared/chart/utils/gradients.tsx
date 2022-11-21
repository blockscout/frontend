import React from 'react';

export const BlueLineGradient = {
  id: 'blue-line-gradient',
  defs: () => (
    <linearGradient id="blue-line-gradient">
      <stop offset="0%" stopColor="#4299E1"/>
      <stop offset="100%" stopColor="#00B5D8"/>
    </linearGradient>
  ),
};

export const RainbowGradient = {
  id: 'rainbow-gradient',
  defs: () => (
    <linearGradient id="rainbow-gradient">
      <stop offset="0%" stopColor="rgba(255, 0, 0, 1)"/>
      <stop offset="10%" stopColor="rgba(255, 154, 0, 1)"/>
      <stop offset="20%" stopColor="rgba(208, 222, 33, 1)"/>
      <stop offset="30%" stopColor="rgba(79, 220, 74, 1)"/>
      <stop offset="40%" stopColor="rgba(63, 218, 216, 1)"/>
      <stop offset="50%" stopColor="rgba(47, 201, 226, 1)"/>
      <stop offset="60%" stopColor="rgba(28, 127, 238, 1)"/>
      <stop offset="70%" stopColor="rgba(95, 21, 242, 1)"/>
      <stop offset="80%" stopColor="rgba(186, 12, 248, 1)"/>
      <stop offset="90%" stopColor="rgba(251, 7, 217, 1)"/>
      <stop offset="100%" stopColor="rgba(255, 0, 0, 1)"/>
    </linearGradient>
  ),
};
