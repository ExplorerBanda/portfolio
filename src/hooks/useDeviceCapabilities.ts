import { useEffect, useState } from 'react';
import type { DeviceCapabilities } from '@/types';

export const useDeviceCapabilities = (): DeviceCapabilities => {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    webgl: false,
    webgl2: false,
    isMobile: false,
    isLowEnd: false,
    reducedMotion: false,
    maxTextureSize: 0,
  });

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

    const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    const isLowEnd = navigator.hardwareConcurrency
      ? navigator.hardwareConcurrency < 4
      : false;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    setCapabilities({
      webgl: !!gl,
      webgl2: !!canvas.getContext('webgl2'),
      isMobile,
      isLowEnd,
      reducedMotion,
      maxTextureSize: gl?.getParameter(gl.MAX_TEXTURE_SIZE) || 1024,
    });
  }, []);

  return capabilities;
};