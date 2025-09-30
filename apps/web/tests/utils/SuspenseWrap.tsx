import React from 'react';

export const SuspenseWrap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <React.Suspense fallback={<div data-testid="loading">loading...</div>}>
        {children}
    </React.Suspense>
);