import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DustParticlesProps {
  /** Number of particles (default: 400) */
  count?: number;
  /** Particle color (default: warm golden) */
  color?: string;
  /** Visibility multiplier (default: 0.4) */
  opacity?: number;
}

export const DustParticles: React.FC<DustParticlesProps> = ({
  count = 400,
  color = '#fff8e0',
  opacity = 0.4,
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, sizes, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = [];

    for (let i = 0; i < count; i++) {
      // Spread across the stage with more vertical distribution
      positions[i * 3] = (Math.random() - 0.5) * 22; // x: wider spread
      positions[i * 3 + 1] = Math.random() * 10 + 1; // y: elevated (above floor)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14; // z: deeper spread

      // Varied particle sizes for depth
      sizes[i] = Math.random() * 0.04 + 0.015;

      // Gentle floating velocities
      velocities.push({
        x: (Math.random() - 0.5) * 0.003,
        y: Math.random() * 0.002 - 0.0005, // Slight upward drift
        z: (Math.random() - 0.5) * 0.003,
      });
    }

    return { positions, sizes, velocities };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const posAttr = pointsRef.current.geometry.attributes.position;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Apply velocity with subtle time-based variation
      const time = state.clock.elapsedTime;
      const turbulence = Math.sin(time * 0.5 + i) * 0.0005;

      posArray[i * 3] += velocities[i].x + turbulence;
      posArray[i * 3 + 1] += velocities[i].y;
      posArray[i * 3 + 2] += velocities[i].z + turbulence * 0.5;

      // Wrap around for infinite float
      if (posArray[i * 3 + 1] > 11) posArray[i * 3 + 1] = 1;
      if (posArray[i * 3 + 1] < 1) posArray[i * 3 + 1] = 11;

      // Horizontal bounds
      if (posArray[i * 3] > 11) posArray[i * 3] = -11;
      if (posArray[i * 3] < -11) posArray[i * 3] = 11;

      if (posArray[i * 3 + 2] > 7) posArray[i * 3 + 2] = -7;
      if (posArray[i * 3 + 2] < -7) posArray[i * 3 + 2] = 7;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
};