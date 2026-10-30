// SPDX-License-Identifier: LicenseRef-Blockscout

import { Switch as ChakraSwitch } from '@chakra-ui/react';
import * as React from 'react';

export interface SwitchProps extends ChakraSwitch.RootProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  labelProps?: ChakraSwitch.LabelProps;
  rootRef?: React.Ref<HTMLLabelElement>;
  trackLabel?: { on: React.ReactNode; off: React.ReactNode };
  thumbLabel?: { on: React.ReactNode; off: React.ReactNode };
}

// Zag visually hides the input with `position: absolute; margin: -1px` and no offsets, so it sits at its static
// position. With `direction="rtl"` (row-reverse) that is the root's end edge, where the negative margin pushes it
// 1px outside the root; focusing it then scrolls the nearest scroll container to reveal it and shifts the content.
const HIDDEN_INPUT_STYLE: React.CSSProperties = { top: 0, insetInlineStart: 0, margin: 0 };

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  function Switch(props, ref) {
    const { inputProps, children, rootRef, trackLabel, thumbLabel, labelProps, ...rest } =
      props;

    const hiddenInputProps = React.useMemo(() => ({
      ...inputProps,
      style: { ...HIDDEN_INPUT_STYLE, ...inputProps?.style },
    }), [ inputProps ]);

    return (
      <ChakraSwitch.Root ref={ rootRef } { ...rest }>
        <ChakraSwitch.HiddenInput ref={ ref } { ...hiddenInputProps }/>
        <ChakraSwitch.Control>
          <ChakraSwitch.Thumb>
            { thumbLabel && (
              <ChakraSwitch.ThumbIndicator fallback={ thumbLabel?.off }>
                { thumbLabel?.on }
              </ChakraSwitch.ThumbIndicator>
            ) }
          </ChakraSwitch.Thumb>
          { trackLabel && (
            <ChakraSwitch.Indicator fallback={ trackLabel.off }>
              { trackLabel.on }
            </ChakraSwitch.Indicator>
          ) }
        </ChakraSwitch.Control >
        { children !== undefined && children !== null && (
          <ChakraSwitch.Label { ...labelProps }>{ children }</ChakraSwitch.Label>
        ) }
      </ChakraSwitch.Root>
    );
  },
);
