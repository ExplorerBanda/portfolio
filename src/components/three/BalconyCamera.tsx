import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useSpotlightStore } from '@/stores/spotlightStore';

// Cinematic theatre balcony camera configuration
const CAMERA_CONFIG = {
  // Position: closer balcony seat with more of the stage architecture in frame
  position: [0.18, 5.75, 12.8] as [number, number, number],

  // Look at point: center stage, slightly above the floor plane
  lookAt: [0, 1.82, -2.95] as [number, number, number],

  // Cinematic balcony field of view
  fov: 44,

  // Depth settings
  near: 0.1,
  far: 100,

  // Idle animation
  idleAmplitude: 0.02,
  idleSpeed: 0.28,
  parallaxStrengthX: 0.12,
  parallaxStrengthY: 0.08,
} as const;

interface BalconyCameraProps {
  /** Enable subtle idle breathing motion */
  enableIdleMotion?: boolean;
  /** Disable camera for transitions */
  disabled?: boolean;
}

export const BalconyCamera: React.FC<BalconyCameraProps> = ({
  enableIdleMotion = true,
  disabled = false,
}) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { smoothX, smoothY } = useSpotlightStore();
  const lookAtTarget = useRef(new THREE.Vector3(...CAMERA_CONFIG.lookAt));

  // Subtle idle breathing animation (human-like micro-movements)
  useFrame((state) => {
    if (disabled || !cameraRef.current) return;

    const time = state.clock.elapsedTime;
    const normalizedX = typeof window !== 'undefined'
      ? (smoothX / window.innerWidth - 0.5) * 2
      : 0;
    const normalizedY = typeof window !== 'undefined'
      ? (smoothY / window.innerHeight - 0.5) * 2
      : 0;
    const parallaxX = normalizedX * CAMERA_CONFIG.parallaxStrengthX;
    const parallaxY = normalizedY * CAMERA_CONFIG.parallaxStrengthY;

    if (enableIdleMotion) {
      // Subtle breathing motion (barely perceptible)
      const breathX = Math.sin(time * CAMERA_CONFIG.idleSpeed) * CAMERA_CONFIG.idleAmplitude;
      const breathY = Math.cos(time * CAMERA_CONFIG.idleSpeed * 0.7) * CAMERA_CONFIG.idleAmplitude;

      cameraRef.current.position.x = CAMERA_CONFIG.position[0] + breathX + parallaxX;
      cameraRef.current.position.y = CAMERA_CONFIG.position[1] + breathY - parallaxY;
      cameraRef.current.position.z = CAMERA_CONFIG.position[2] - Math.abs(parallaxX) * 0.08;
    } else {
      cameraRef.current.position.set(
        CAMERA_CONFIG.position[0] + parallaxX,
        CAMERA_CONFIG.position[1] - parallaxY,
        CAMERA_CONFIG.position[2]
      );
    }

    lookAtTarget.current.set(
      CAMERA_CONFIG.lookAt[0] + parallaxX * 0.12,
      CAMERA_CONFIG.lookAt[1] - parallaxY * 0.08,
      CAMERA_CONFIG.lookAt[2]
    );
    cameraRef.current.lookAt(lookAtTarget.current);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={CAMERA_CONFIG.position}
      fov={CAMERA_CONFIG.fov}
      near={CAMERA_CONFIG.near}
      far={CAMERA_CONFIG.far}
    />
  );
};

// Foreground balcony silhouette for depth framing
export const BalconyForeground: React.FC = () => {
  return (
    <group position={[0, -1.2, 8.8]}>
      <mesh position={[0, -0.12, 0.1]}>
        <boxGeometry args={[24, 0.55, 1.15]} />
        <meshStandardMaterial color="#531114" roughness={0.9} metalness={0.06} />
      </mesh>

      <mesh position={[0, 0.62, -0.22]}>
        <boxGeometry args={[24, 0.16, 0.2]} />
        <meshStandardMaterial
          color="#c6a061"
          emissive="#7d612c"
          emissiveIntensity={0.18}
          roughness={0.3}
          metalness={0.75}
        />
      </mesh>

      {Array.from({ length: 13 }).map((_, index) => {
        const x = -11.4 + index * 1.9;
        return (
          <mesh key={index} position={[x, 0.2, -0.22]}>
            <cylinderGeometry args={[0.05, 0.06, 0.72, 10]} />
            <meshStandardMaterial
              color="#b38847"
              emissive="#694c1c"
              emissiveIntensity={0.08}
              roughness={0.34}
              metalness={0.8}
            />
          </mesh>
        );
      })}

      {Array.from({ length: 9 }).map((_, index) => {
        const x = -8 + index * 2;
        return (
          <group key={`seat-${index}`} position={[x, -0.48, 0.64]}>
            <mesh position={[0, 0.22, 0]}>
              <boxGeometry args={[1.46, 0.52, 0.88]} />
              <meshStandardMaterial color="#641316" roughness={0.93} metalness={0.05} />
            </mesh>
            <mesh position={[0, 0.56, -0.28]}>
              <boxGeometry args={[1.46, 0.72, 0.22]} />
              <meshStandardMaterial color="#6b1619" roughness={0.94} metalness={0.05} />
            </mesh>
          </group>
        );
      })}

      <mesh position={[0, -1.05, -0.7]}>
        <boxGeometry args={[28, 1.15, 2.3]} />
        <meshStandardMaterial
          color="#0d0d12"
          emissive="#0d0d12"
          emissiveIntensity={0.05}
          roughness={0.96}
        />
      </mesh>

      <mesh position={[-12.4, 4.5, -8.1]} rotation={[0, 0.18, 0]}>
        <boxGeometry args={[2.4, 11, 0.9]} />
        <meshStandardMaterial
          color="#230404"
          roughness={0.92}
          metalness={0.08}
        />
      </mesh>
      <mesh position={[12.4, 4.5, -8.1]} rotation={[0, -0.18, 0]}>
        <boxGeometry args={[2.4, 11, 0.9]} />
        <meshStandardMaterial
          color="#230404"
          roughness={0.92}
          metalness={0.08}
        />
      </mesh>

      <mesh position={[0, 9.05, -8.6]}>
        <boxGeometry args={[21, 0.82, 0.7]} />
        <meshStandardMaterial
          color="#150608"
          emissive="#150608"
          emissiveIntensity={0.04}
          roughness={0.95}
        />
      </mesh>
    </group>
  );
};

export const HouseCeilingLights: React.FC = () => {
  const positions = [-5.4, -2.7, 0, 2.7, 5.4];

  return (
    <group position={[0, 8.85, 7.9]}>
      {positions.map((x, index) => (
        <group key={index} position={[x, 0, 0]}>
          <mesh position={[0, -0.45, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.9, 10]} />
            <meshStandardMaterial
              color="#9f7b43"
              roughness={0.35}
              metalness={0.82}
            />
          </mesh>
          <mesh position={[0, -1.03, 0]}>
            <sphereGeometry args={[0.28, 18, 18]} />
            <meshStandardMaterial
              color="#ffd699"
              emissive="#ffd699"
              emissiveIntensity={1.35}
              roughness={0.22}
              metalness={0.06}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Theatre fog for atmospheric depth
// Subtle gradient from near to far - creates depth without obscuring props
export const TheatreFog: React.FC = () => {
  return (
    <fog
      attach="fog"
      args={['#1b140f', 9, 36]}
    />
  );
};

// Warm golden theatre ambient lighting - darker environment, spotlight-focused
export const TheatreLighting: React.FC = () => {
  return (
    <>
      {/* Softer ambient base so the stage is always readable */}
      <ambientLight intensity={0.24} color="#cfa677" />

      {/* Warm room fill for audience and stage readability */}
      <hemisphereLight
        intensity={0.24}
        color="#3a2a20"
        groundColor="#120c08"
      />

      <pointLight position={[0, 8.1, 7.2]} intensity={4.2} distance={18} decay={1.8} color="#ffd699" />
      <pointLight position={[-7.5, 6.5, 3.5]} intensity={2.6} distance={13} decay={2} color="#f7c97f" />
      <pointLight position={[7.5, 6.5, 3.5]} intensity={2.6} distance={13} decay={2} color="#f7c97f" />

      {/* Wide warm stage wash so the stage reads clearly even without the spotlight */}
      <directionalLight
        position={[0, 8, 1.5]}
        intensity={0.62}
        color="#FFD699"
      />

      {/* Focused stage wash that adds emphasis rather than being the only visibility source */}
      <spotLight
        position={[0, 12, 5]}
        angle={0.58}
        penumbra={0.9}
        intensity={26}
        distance={28}
        decay={1.7}
        color="#f7d6a1"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        target-position={[0, 0.5, -2.2]}
      />

      {/* Soft cross-fill from stage left */}
      <directionalLight
        position={[-8, 4, 4]}
        intensity={0.24}
        color="#d9a86c"
      />

      {/* Soft cross-fill from stage right */}
      <directionalLight
        position={[8, 4, 3]}
        intensity={0.2}
        color="#c99663"
      />

      {/* Low back rim for backdrop separation */}
      <directionalLight
        position={[0, 6, -12]}
        intensity={0.22}
        color="#b27b58"
      />

      {/* Warm rim light behind the props for silhouette separation */}
      <pointLight
        position={[0, 3.9, -7.6]}
        intensity={1.8}
        distance={14}
        decay={2}
        color="#ffb347"
      />

      {/* Cool background fade so the back wall drops away behind the props */}
      <pointLight
        position={[0, 4.8, -9.8]}
        intensity={2.2}
        distance={13}
        decay={2}
        color="#4a2c22"
      />
    </>
  );
};
