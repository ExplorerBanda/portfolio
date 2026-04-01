import React, { useEffect, useRef } from 'react';
import { useSpotlightStore } from '@/stores/spotlightStore';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

export const SpotlightOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const capabilities = useDeviceCapabilities();

  const { smoothX, smoothY, size, isHovering } = useSpotlightStore();

  useEffect(() => {
    if (capabilities.reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;

    const render = () => {
      // Set canvas size
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate spotlight size (larger when hovering)
      const spotlightRadius = isHovering ? size * 1.08 : size;

      // Create radial gradient for spotlight
      const gradient = ctx.createRadialGradient(
        smoothX,
        smoothY,
        0,
        smoothX,
        smoothY,
        spotlightRadius
      );

      // Gradient stops for soft edge
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.015)');
      gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.08)');
      gradient.addColorStop(0.88, 'rgba(0, 0, 0, 0.52)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.68)');

      // Draw spotlight mask
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add subtle vignette
      const vignette = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.height * 0.3,
        canvas.width / 2,
        canvas.height / 2,
        canvas.height
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(20, 12, 8, 0.16)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add subtle golden glow near hotspot (cinematic feel)
      const glowGradient = ctx.createRadialGradient(
        smoothX,
        smoothY,
        0,
        smoothX,
        smoothY,
        spotlightRadius * 1.3
      );
      glowGradient.addColorStop(0, 'rgba(255, 215, 0, 0.06)');
      glowGradient.addColorStop(0.45, 'rgba(255, 215, 0, 0.02)');
      glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Extra glow when hovering over props
      if (isHovering) {
        const hoverGlow = ctx.createRadialGradient(
          smoothX,
          smoothY,
          spotlightRadius * 0.5,
          smoothX,
          smoothY,
          spotlightRadius * 1.8
        );
        hoverGlow.addColorStop(0, 'rgba(255, 215, 0, 0.1)');
        hoverGlow.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = hoverGlow;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [smoothX, smoothY, size, isHovering, capabilities.reducedMotion]);

  // Reduced motion fallback - static mask
  if (capabilities.reducedMotion) {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-40"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.9) 100%)',
        }}
      />
    );
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-40"
        style={{ mixBlendMode: 'multiply' }}
      />
      {/* Custom cursor */}
      <div
        className="fixed pointer-events-none z-50 rounded-full border border-theatre-cream/50 transition-[width,height,border-color,box-shadow,background-color] duration-200"
        style={{
          left: smoothX,
          top: smoothY,
          transform: 'translate(-50%, -50%)',
          borderColor: isHovering ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255, 248, 231, 0.5)',
          width: isHovering ? '32px' : '14px',
          height: isHovering ? '32px' : '14px',
          backgroundColor: isHovering ? 'rgba(255, 215, 0, 0.06)' : 'rgba(255, 248, 231, 0.02)',
          boxShadow: isHovering
            ? '0 0 18px rgba(255, 215, 0, 0.28)'
            : '0 0 12px rgba(255, 248, 231, 0.08)',
          willChange: 'transform, width, height',
        }}
      />
    </>
  );
};
