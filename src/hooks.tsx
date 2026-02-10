import React from 'react';
import ReactDOM from 'react-dom';

import { ConfirmState } from './state';
import type { ConfirmOptions } from './types';

export function useAffirm() {
  const [state, setState] = React.useState<{ isOpen: boolean; options: ConfirmOptions }>({
    isOpen: false,
    options: {} as ConfirmOptions,
  });

  React.useEffect(() => {
    return ConfirmState.subscribe((newState) => {
      // Prevent batching, temp solution.
      setTimeout(() => {
        ReactDOM.flushSync(() => {
          setState({ isOpen: newState.isOpen, options: newState.options });
        });
      });
    });
  }, []);

  return {
    state,
  };
}
