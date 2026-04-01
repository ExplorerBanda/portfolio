import React, { useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSpotlightStore } from '@/stores/spotlightStore';
import { useTheatreStore } from '@/stores/theatreStore';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import { StageProp } from './StageProp';
import { DustParticles } from './DustParticles';
import { ProjectionScreenContent } from './ProjectionScreenContent';
import { stageProps } from '@/data/content';
import {
  BalconyCamera,
  BalconyForeground,
  TheatreFog,
  TheatreLighting,
} from './BalconyCamera';

// Spotlight that follows mouse - constrained to stage area
const MovingSpotlight: React.FC = () => {
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);
  const { smoothX, smoothY, isHovering } = useSpotlightStore();
  const activeProp = useTheatreStore((state) => state.activeProp);

  // Stage boundaries for spotlight clamping
  const STAGE_BOUNDS = {
    xMin: -5.6,
    xMax: 5.6,
    zMin: -6.6,
    zMax: 1.8,
  };

  const { viewport } = useThree();

  useFrame(() => {
    if (!lightRef.current || !targetRef.current) return;

    const activePropData = activeProp
      ? stageProps.find((prop) => prop.id === activeProp)
      : null;

    let worldX: number;
    let worldZ: number;

    if (activePropData) {
      worldX = activePropData.position[0];
      worldZ = activePropData.position[2];
    } else {
      // Convert screen coords to world position
      const x = (smoothX / window.innerWidth) * 2 - 1;
      const y = -(smoothY / window.innerHeight) * 2 + 1;

      // Map to stage coordinates
      worldX = x * viewport.width * 0.46;
      worldZ = y * 4.3 - 2.1;
    }

    // CLAMP to stage boundaries
    const clampedX = THREE.MathUtils.clamp(
      worldX,
      STAGE_BOUNDS.xMin,
      STAGE_BOUNDS.xMax
    );
    const clampedZ = THREE.MathUtils.clamp(
      worldZ,
      STAGE_BOUNDS.zMin,
      STAGE_BOUNDS.zMax
    );

    // Smooth movement with interpolation
    targetRef.current.position.x = THREE.MathUtils.lerp(
      targetRef.current.position.x,
      clampedX,
      0.08
    );
    targetRef.current.position.z = THREE.MathUtils.lerp(
      targetRef.current.position.z,
      clampedZ,
      0.08
    );

    // Update light target
    lightRef.current.target.position.copy(targetRef.current.position);
    lightRef.current.intensity = THREE.MathUtils.lerp(
      lightRef.current.intensity,
      activePropData ? 134 : isHovering ? 126 : 108,
      0.08
    );
    lightRef.current.angle = THREE.MathUtils.lerp(
      lightRef.current.angle,
      activePropData ? 0.4 : isHovering ? 0.44 : 0.48,
      0.08
    );
  });

  return (
    <>
      <object3D ref={targetRef} position={[0, 0, 0]} />
      <spotLight
        ref={lightRef}
        position={[0, 15, 5]}
        angle={0.48}
        penumbra={0.82}
        intensity={118}
        color="#fff8e7"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </>
  );
};

// Stage floor with dark wood texture
const StageFloor: React.FC = () => {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, -1.2]} receiveShadow>
        <planeGeometry args={[36, 18.5]} />
        <meshPhysicalMaterial
          color="#2a1810"
          roughness={0.62}
          metalness={0.12}
          clearcoat={0.38}
          clearcoatRoughness={0.7}
          reflectivity={0.24}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, -1.2]}>
        <planeGeometry args={[36, 18.5]} />
        <meshBasicMaterial color="#6b3b1d" transparent opacity={0.05} />
      </mesh>
      <mesh position={[0, -0.15, 8.1]} receiveShadow>
        <boxGeometry args={[36, 0.7, 1.8]} />
        <meshStandardMaterial color="#1a0f0a" roughness={0.82} metalness={0.08} />
      </mesh>
    </group>
  );
};

// Back wall with depth
const BackWall: React.FC = () => {
  return (
    <group>
      <mesh position={[0, 5, -9.7]} receiveShadow>
        <planeGeometry args={[30, 13]} />
        <meshStandardMaterial
          color="#0d0d14"
          roughness={0.97}
          metalness={0.03}
        />
      </mesh>
      <mesh position={[0, 5.2, -9.55]}>
        <planeGeometry args={[19, 8]} />
        <meshBasicMaterial color="#5d241d" transparent opacity={0.08} />
      </mesh>
    </group>
  );
};

const CenterStageAccentLight: React.FC = () => {
  const beamFloorY = 0.03;
  const beamSourceY = 8.85;
  const beamHeight = beamSourceY - beamFloorY;
  const beamAngle = 0.245;
  const beamRadius = Math.tan(beamAngle) * beamHeight;
  const beamCenterY = beamFloorY + beamHeight / 2;
  const spotlightPoolTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return new THREE.CanvasTexture(canvas);
    }

    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 198, 64, 0.55)');
    gradient.addColorStop(0.42, 'rgba(255, 184, 48, 0.18)');
    gradient.addColorStop(0.72, 'rgba(255, 168, 42, 0.06)');
    gradient.addColorStop(1, 'rgba(255, 168, 42, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  return (
    <group position={[0, 0, -1.95]}>
      <mesh position={[0, beamCenterY, 0]}>
        <coneGeometry args={[beamRadius, beamHeight, 32, 1, true]} />
        <meshBasicMaterial
          color="#ffb000"
          transparent
          opacity={0.055}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh position={[0, beamFloorY + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[beamRadius * 2.18, beamRadius * 2.18]} />
        <meshBasicMaterial
          map={spotlightPoolTexture}
          alphaMap={spotlightPoolTexture}
          transparent
          opacity={0.11}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#ffcf6d"
        />
      </mesh>

      <mesh position={[0, beamSourceY, 0.02]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial
          color="#ffd36b"
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh position={[0, beamSourceY - 0.03, -0.12]}>
        <circleGeometry args={[0.62, 24]} />
        <meshBasicMaterial
          color="#ffb347"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <pointLight
        position={[0, beamSourceY - 0.18, -0.08]}
        intensity={2.1}
        distance={12}
        decay={2}
        color="#ffb347"
      />
    </group>
  );
};

const ProsceniumFrame: React.FC = () => {
  const activeProp = useTheatreStore((state) => state.activeProp);

  return (
    <group position={[0, 2.9, -5.65]}>
      <mesh position={[-9.2, 0.9, 0]}>
        <boxGeometry args={[1.25, 7.8, 1.1]} />
        <meshStandardMaterial color="#9a7230" roughness={0.42} metalness={0.62} />
      </mesh>
      <mesh position={[9.2, 0.9, 0]}>
        <boxGeometry args={[1.25, 7.8, 1.1]} />
        <meshStandardMaterial color="#9a7230" roughness={0.42} metalness={0.62} />
      </mesh>
      <mesh position={[0, 4.95, 0]}>
        <boxGeometry args={[20, 1.28, 1.18]} />
        <meshStandardMaterial color="#aa8137" roughness={0.4} metalness={0.64} />
      </mesh>
      <mesh position={[0, 0.95, -0.02]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[9.2, 0.6, 18, 54, Math.PI]} />
        <meshStandardMaterial color="#b3893a" roughness={0.36} metalness={0.66} />
      </mesh>
      <mesh position={[0, 0.45, -0.45]}>
        <boxGeometry args={[16.5, 6.35, 0.3]} />
        <meshStandardMaterial
          color="#f0e7d8"
          emissive="#c7baa2"
          emissiveIntensity={activeProp ? 0.22 : 0.08}
          roughness={0.9}
          metalness={0.01}
        />
      </mesh>
      {activeProp && (
        <mesh position={[0, 0.45, -0.18]}>
          <planeGeometry args={[15.8, 5.8]} />
          <meshBasicMaterial
            color="#f5e6c8"
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
      <mesh position={[0, 3.65, 0.18]}>
        <boxGeometry args={[17.5, 0.58, 0.35]} />
        <meshStandardMaterial color="#4a090d" roughness={0.94} metalness={0.04} />
      </mesh>
    </group>
  );
};

const ProsceniumPracticalLights: React.FC = () => {
  const archBulbs = Array.from({ length: 19 }, (_, index) => {
    const x = -8.55 + index * 0.95;
    return [x, 5.05, 0.62] as [number, number, number];
  });

  const sideBulbs = Array.from({ length: 8 }, (_, index) => {
    const y = -1.95 + index * 0.96;
    return [
      [-9.85, y, 0.62] as [number, number, number],
      [9.85, y, 0.62] as [number, number, number],
    ];
  }).flat();

  const bulbMaterial = (
    <meshStandardMaterial
      color="#ffd699"
      emissive="#ffd699"
      emissiveIntensity={1.45}
      roughness={0.2}
      metalness={0.04}
    />
  );

  return (
    <group position={[0, 2.9, -5.65]}>
      {[...archBulbs, ...sideBulbs].map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[0.14, 14, 14]} />
          {bulbMaterial}
        </mesh>
      ))}

      <pointLight position={[0, 5.15, 1.2]} intensity={2.2} distance={10} decay={2} color="#ffd699" />
      <pointLight position={[-9.3, 1.4, 1.2]} intensity={1.4} distance={8} decay={2} color="#ffd699" />
      <pointLight position={[9.3, 1.4, 1.2]} intensity={1.4} distance={8} decay={2} color="#ffd699" />
    </group>
  );
};

const OperaSideBoxes: React.FC = () => {
  const levels = [1.2, 3.7, 6.2];

  return (
    <>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 12.15, 0, -0.8]} rotation={[0, side * -0.05, 0]}>
          <mesh position={[0, 4.2, -1.6]}>
            <boxGeometry args={[4.2, 9.6, 3.6]} />
            <meshStandardMaterial color="#2b130d" roughness={0.9} metalness={0.08} />
          </mesh>

          {levels.map((y, index) => (
            <group key={index} position={[0, y, 0]}>
              <mesh position={[0, 0.15, 1.45]}>
                <boxGeometry args={[3.9, 0.16, 2.8]} />
                <meshStandardMaterial color="#c89c53" roughness={0.35} metalness={0.74} />
              </mesh>
              <mesh position={[0, -0.42, 1.12]}>
                <boxGeometry args={[4.15, 0.86, 2.1]} />
                <meshStandardMaterial color="#4c0d11" roughness={0.95} metalness={0.04} />
              </mesh>
              <mesh position={[0, 0.72, 0.38]}>
                <boxGeometry args={[4.05, 1.1, 2.6]} />
                <meshStandardMaterial color="#2a110b" roughness={0.94} metalness={0.06} />
              </mesh>

              {[-1.25, 0, 1.25].map((seatX) => (
                <mesh key={seatX} position={[seatX, -0.08, 1.38]}>
                  <boxGeometry args={[0.72, 0.34, 0.74]} />
                  <meshStandardMaterial color="#75191d" roughness={0.92} metalness={0.03} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      ))}
    </>
  );
};

// Red velvet side curtains with proper material
const SideCurtains: React.FC = () => {
  const curtainMaterial = (
    <meshStandardMaterial
      color="#8B0000"
      roughness={0.8}
      metalness={0.05}
      side={THREE.DoubleSide}
    />
  );

  return (
    <>
      {/* Left curtain */}
      <mesh position={[-16, 5, 0]} rotation={[0, 0.3, 0]}>
        <planeGeometry args={[5.2, 12]} />
        {curtainMaterial}
      </mesh>

      {/* Right curtain */}
      <mesh position={[16, 5, 0]} rotation={[0, -0.3, 0]}>
        <planeGeometry args={[5.2, 12]} />
        {curtainMaterial}
      </mesh>

      {/* Top valance curtain */}
      <mesh position={[0, 11, -2]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[36, 4]} />
        {curtainMaterial}
      </mesh>
    </>
  );
};

// Main scene content
const Scene: React.FC = () => {
  const { acts, currentAct, activeProp, setActiveProp, spotlightEnabled } = useTheatreStore();
  const visibleProps = acts[currentAct]?.props ?? [];
  const activeStageProps = stageProps.filter((prop) => visibleProps.includes(prop.id));

  return (
    <>
      {/* Theatre lighting - warm golden */}
      <TheatreLighting />

      {/* Moving spotlight */}
      {spotlightEnabled && <MovingSpotlight />}

      {/* Atmospheric fog for depth */}
      <TheatreFog />

      {/* Stage structure */}
      <StageFloor />
      <BackWall />
      <ProjectionScreenContent propId={activeProp} />
      <CenterStageAccentLight />
      <ProsceniumFrame />
      <ProsceniumPracticalLights />
      <OperaSideBoxes />
      <SideCurtains />

      {/* Interactive props */}
      {activeStageProps.map((prop) => (
        <StageProp
          key={prop.id}
          propData={prop}
          onClick={() => setActiveProp(activeProp === prop.id ? null : prop.id)}
        />
      ))}

      {/* Volumetric dust particles */}
      <DustParticles />

      {/* Foreground balcony silhouette for framing */}
      <BalconyForeground />
    </>
  );
};

// Main theatre stage component
const TheatreStage: React.FC = () => {
  const isMobile = useTheatreStore((s) => s.isMobile);
  const capabilities = useDeviceCapabilities();

  if (isMobile) return null;

  return (
    <Canvas
      shadows={!capabilities.isLowEnd}
      dpr={capabilities.isLowEnd ? 1 : [1, 1.5]}
      gl={{ antialias: true, alpha: false }}
      onPointerMissed={() => useTheatreStore.getState().setActiveProp(null)}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.28;
      }}
      style={{ position: 'fixed', inset: 0, zIndex: 1 }}
    >
      {/* Cinematic balcony camera */}
      <BalconyCamera enableIdleMotion={true} />

      {/* Background color */}
      <color attach="background" args={['#0a0a0f']} />

      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
};

export default TheatreStage;
