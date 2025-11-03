'use client';

import { Suspense } from 'react';
import CallbackBody from './CallbackBody';

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Connecting Gmail...</div>}>
      <CallbackBody />
    </Suspense>
  );
}
