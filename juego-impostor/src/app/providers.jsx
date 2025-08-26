'use client';

import FullScreenWrapper from './components/FullScreenWrapper';

export function Providers({ children }) {
  return (
    <FullScreenWrapper>
      {children}
    </FullScreenWrapper>
  );
}
