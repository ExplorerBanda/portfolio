import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TheatreEffectsProps {
  /** Bloom intensity (default: 0.3) */
  bloomIntensity?: number;
  /** Vignette darkness (default: 0.4) */
  vignetteDarkness?: number;
  /** Enable noise grain (default: true) */
  enableNoise?: boolean;
}

/**
 * Cinematic post-processing effects for theatre scene
 * Adds bloom, vignette, and subtle film grain
 *
 * NOTE: Requires @react-three/postprocessing package
 * Install: npm install @react-three/postprocessing
 *
 * This component is a placeholder - actual effects are done via CSS
 */
export const TheatreEffects: React.FC<TheatreEffectsProps> = () => {
  // Post-processing effects are handled via CSS overlays for performance
  return null;
};

/**
 * Volumetric spotlight cone visualization
 * Creates a visible light beam effect
 */
export const VolumetricSpotlight: React.FC<{
  position?: [number, number, number];
  color?: string;
  intensity?: number;
}> = ({
  position = [0, 15, 5],
  color = '#fff8e7',
  intensity = 1,
}) => {
  const coneRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coneRef.current && coneRef.current.material) {
      // Subtle flickering for realistic light
      (coneRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.03 + Math.sin(state.clock.elapsedTime * 2) * 0.01;
    }
  });

  return (
    <group position={position}>
      {/* Volumetric cone */}
      <mesh
        ref={coneRef}
        position={[0, -6, -2.5]}
        rotation={[-0.3, 0, 0]}
      >
        <coneGeometry args={[3, 12, 32, 1, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Actual spotlight */}
      <spotLight
        position={[0, 0, 0]}
        angle={0.5}
        penumbra={0.5}
        intensity={100 * intensity}
        color={color}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </group>
  );
};
