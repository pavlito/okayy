'use client';

import React from 'react';

import { ConfirmState } from './state';

export function useOkayy() {
  const state = React.useSyncExternalStore(
    ConfirmState.subscribe,
    ConfirmState.getSnapshot,
    ConfirmState.getSnapshot,
  );

  return {
    state: { isOpen: state.isOpen, options: state.options },
  };
}
