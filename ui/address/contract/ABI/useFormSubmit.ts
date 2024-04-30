import React from 'react';

import type { FormSubmitHandler } from './types';

import config from 'configs/app';

function useFormSubmit(): FormSubmitHandler {

  return React.useCallback(async() => {}, []);
}

function useFormSubmitFallback(): FormSubmitHandler {

  return React.useCallback(async() => {}, []);
}

const hook = config.features.blockchainInteraction.isEnabled ? useFormSubmit : useFormSubmitFallback;

export default hook;
