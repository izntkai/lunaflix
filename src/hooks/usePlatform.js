import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export const usePlatform = () => {
  const [isNative, setIsNative] = useState(Capacitor.isNativePlatform());

  useEffect(() => {
    // Re-check just in case of environment changes
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  return { isNative };
};
