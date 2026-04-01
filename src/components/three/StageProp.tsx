import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Outlines, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Prop } from '@/types';
import { useSpotlightStore } from '@/stores/spotlightStore';

interface StagePropProps {
  propData: Prop;
  onClick: () => void;
}

const BorderGlow: React.FC<{ visible: boolean; color?: string }> = ({
  visible,
  color = '#ffd699',
}) =>
  visible ? (
    <>
      <Outlines
        color={color}
        opacity={0.72}
        transparent
        thickness={0.032}
        angle={Math.PI}
        screenspace={false}
      />
      <Outlines
        color="#fff4cf"
        opacity={0.18}
        transparent
        thickness={0.11}
        angle={Math.PI}
        screenspace={false}
      />
    </>
  ) : null;

// Geometric representations of props with soft shadow grounding
const PropGeometry: React.FC<{ propId: string; color: string; isHovered: boolean }> = ({
  propId,
  color,
  isHovered,
}) => {
  const scale = isHovered ? 1.05 : 1;

  // Subtle hover elevation
  const elevationY = isHovered ? 0.08 : 0;

  switch (propId) {
    case 'microphone':
      return (
        <group scale={scale} position={[0, elevationY, 0]}>
          {/* Soft pool shadow underneath */}
          <mesh position={[0, -1.62, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.15, 0.72, 1]}>
            <circleGeometry args={[0.42, 24]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={isHovered ? 0.28 : 0.15}
              depthWrite={false}
            />
          </mesh>

          {/* Ceiling cable */}
          <mesh position={[0, 3.58, 0]} castShadow>
            <cylinderGeometry args={[0.014, 0.014, 6.88, 12]} />
            <meshStandardMaterial color="#161616" metalness={0.24} roughness={0.72} />
          </mesh>

          {/* Ceiling mount point */}
          <mesh position={[0, 7.04, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.08, 14]} />
            <meshStandardMaterial color="#5e4a34" metalness={0.38} roughness={0.56} />
          </mesh>

          {/* Cable mount */}
          <mesh position={[0, 0.14, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.05, 0.18, 14]} />
            <meshStandardMaterial color="#b89252" metalness={0.84} roughness={0.24} />
          </mesh>

          {/* Connector stem */}
          <mesh position={[0, -0.04, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.18, 12]} />
            <meshStandardMaterial color="#5a5a5a" metalness={0.85} roughness={0.24} />
          </mesh>

          {/* Hanging loop */}
          <mesh position={[0, -0.14, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.08, 0.014, 10, 24]} />
            <meshStandardMaterial color="#7c7c7c" metalness={0.88} roughness={0.22} />
          </mesh>

          {/* Main mic shell */}
          <mesh position={[0, -0.72, 0]} castShadow receiveShadow>
            <capsuleGeometry args={[0.26, 0.62, 10, 18]} />
            <meshStandardMaterial
              color="#d7d7d3"
              metalness={0.96}
              roughness={0.18}
              emissive="#000000"
              emissiveIntensity={0}
            />
            <BorderGlow visible={isHovered} />
          </mesh>

          {/* Front grill bars */}
          {Array.from({ length: 7 }).map((_, index) => (
            <mesh key={`grill-${index}`} position={[0, -1 + index * 0.1, 0.245]} castShadow>
              <boxGeometry args={[0.42, 0.028, 0.03]} />
              <meshStandardMaterial color="#222" metalness={0.62} roughness={0.36} />
            </mesh>
          ))}

          {/* Side vents */}
          {[-0.21, 0.21].flatMap((xPos) =>
            Array.from({ length: 5 }).map((_, index) => (
              <mesh
                key={`vent-${xPos}-${index}`}
                position={[xPos, -0.96 + index * 0.11, 0.08]}
                rotation={[0, Math.PI / 2, 0]}
                castShadow
              >
                <boxGeometry args={[0.18, 0.022, 0.02]} />
                <meshStandardMaterial color="#2a2a2a" metalness={0.56} roughness={0.4} />
              </mesh>
            ))
          )}

          {/* Bottom chrome cap */}
          <mesh position={[0, -1.22, 0]} castShadow>
            <torusGeometry args={[0.19, 0.04, 10, 22]} />
            <meshStandardMaterial color="#cacaca" metalness={0.92} roughness={0.18} />
          </mesh>
        </group>
      );

    case 'laptop':
      return (
        <group scale={scale} rotation={[0, 0.12, 0]} position={[0, elevationY, 0]}>
          {/* Soft shadow */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.35, 0.9, 1]}>
            <circleGeometry args={[0.7, 22]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={isHovered ? 0.34 : 0.18}
              depthWrite={false}
            />
          </mesh>

          {/* Toolbox body */}
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.34, 0.66, 0.72]} />
            <meshStandardMaterial color="#c92d26" metalness={0.08} roughness={0.5} />
            <BorderGlow visible={isHovered} />
          </mesh>

          {/* Front lip */}
          <mesh position={[0, 0.48, 0.22]} castShadow receiveShadow>
            <boxGeometry args={[1.22, 0.18, 0.12]} />
            <meshStandardMaterial color="#d5372f" metalness={0.06} roughness={0.48} />
          </mesh>

          {/* Handle supports */}
          <mesh position={[-0.24, 0.84, -0.06]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.34, 12]} />
            <meshStandardMaterial color="#d34136" metalness={0.08} roughness={0.42} />
          </mesh>
          <mesh position={[0.24, 0.84, -0.06]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.34, 12]} />
            <meshStandardMaterial color="#d34136" metalness={0.08} roughness={0.42} />
          </mesh>
          <mesh position={[0, 1.02, -0.06]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.48, 12]} />
            <meshStandardMaterial color="#d34136" metalness={0.08} roughness={0.42} />
          </mesh>

          {/* Yellow pencil */}
          <mesh position={[-0.4, 0.92, 0]} rotation={[0, 0, -0.12]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.92, 16]} />
            <meshStandardMaterial color="#f4d33f" metalness={0.04} roughness={0.58} />
            <BorderGlow visible={isHovered} />
          </mesh>
          <mesh position={[-0.4, 1.38, 0]} rotation={[0, 0, -0.12]} castShadow>
            <coneGeometry args={[0.08, 0.16, 12]} />
            <meshStandardMaterial color="#f2c9a0" roughness={0.7} metalness={0.02} />
          </mesh>

          {/* Orange spanner */}
          <mesh position={[-0.12, 1, 0.04]} rotation={[0, 0, 0.18]} castShadow>
            <boxGeometry args={[0.16, 0.9, 0.08]} />
            <meshStandardMaterial color="#f08a21" roughness={0.5} metalness={0.06} />
            <BorderGlow visible={isHovered} />
          </mesh>
          <mesh position={[-0.12, 1.4, 0.04]} castShadow>
            <torusGeometry args={[0.11, 0.03, 8, 16, Math.PI * 1.35]} />
            <meshStandardMaterial color="#f08a21" roughness={0.5} metalness={0.06} />
          </mesh>

          {/* Blue plier center */}
          <mesh position={[0.12, 0.98, 0]} rotation={[0, 0, -0.08]} castShadow>
            <boxGeometry args={[0.16, 0.82, 0.08]} />
            <meshStandardMaterial color="#67c9ef" roughness={0.44} metalness={0.1} />
            <BorderGlow visible={isHovered} />
          </mesh>
          <mesh position={[0.02, 1.38, 0.02]} rotation={[0, 0, 0.36]} castShadow>
            <boxGeometry args={[0.14, 0.36, 0.07]} />
            <meshStandardMaterial color="#67c9ef" roughness={0.44} metalness={0.1} />
          </mesh>
          <mesh position={[0.22, 1.38, 0.02]} rotation={[0, 0, -0.36]} castShadow>
            <boxGeometry args={[0.14, 0.36, 0.07]} />
            <meshStandardMaterial color="#67c9ef" roughness={0.44} metalness={0.1} />
          </mesh>

          {/* Purple screwdriver */}
          <mesh position={[0.38, 0.96, 0.06]} rotation={[0, 0, 0.06]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.72, 16]} />
            <meshStandardMaterial color="#8d7be6" roughness={0.5} metalness={0.06} />
            <BorderGlow visible={isHovered} />
          </mesh>
          <mesh position={[0.38, 1.34, 0.06]} castShadow>
            <coneGeometry args={[0.06, 0.16, 10]} />
            <meshStandardMaterial color="#d9dde3" roughness={0.36} metalness={0.64} />
          </mesh>

          {/* Side pink block tool */}
          <mesh position={[0.54, 0.78, -0.02]} castShadow receiveShadow>
            <boxGeometry args={[0.28, 0.42, 0.22]} />
            <meshStandardMaterial color="#d662bb" roughness={0.46} metalness={0.08} />
            <BorderGlow visible={isHovered} />
          </mesh>

          {/* Small eyes on tools for playful read */}
          {[
            [-0.4, 1.14, 0.085],
            [-0.14, 1.16, 0.085],
            [0.12, 1.12, 0.085],
            [0.38, 1.1, 0.085],
            [0.54, 0.86, 0.14],
          ].map((pos, index) => (
            <mesh key={`tool-eye-left-${index}`} position={[pos[0] - 0.03, pos[1], pos[2]] as [number, number, number]} castShadow>
              <sphereGeometry args={[0.028, 12, 12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.58} />
            </mesh>
          ))}
          {[
            [-0.4, 1.14, 0.085],
            [-0.14, 1.16, 0.085],
            [0.12, 1.12, 0.085],
            [0.38, 1.1, 0.085],
            [0.54, 0.86, 0.14],
          ].map((pos, index) => (
            <mesh key={`tool-eye-right-${index}`} position={[pos[0] + 0.03, pos[1], pos[2]] as [number, number, number]} castShadow>
              <sphereGeometry args={[0.028, 12, 12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.58} />
            </mesh>
          ))}
          {[
            [-0.4, 1.14, 0.11],
            [-0.14, 1.16, 0.11],
            [0.12, 1.12, 0.11],
            [0.38, 1.1, 0.11],
            [0.54, 0.86, 0.165],
          ].map((pos, index) => (
            <mesh key={`tool-pupil-left-${index}`} position={[pos[0] - 0.012, pos[1], pos[2]] as [number, number, number]} castShadow>
              <sphereGeometry args={[0.012, 10, 10]} />
              <meshStandardMaterial
                color="#1f1a16"
                emissive={isHovered ? color : '#000000'}
                emissiveIntensity={isHovered ? 0.12 : 0}
              />
            </mesh>
          ))}
          {[
            [-0.4, 1.14, 0.11],
            [-0.14, 1.16, 0.11],
            [0.12, 1.12, 0.11],
            [0.38, 1.1, 0.11],
            [0.54, 0.86, 0.165],
          ].map((pos, index) => (
            <mesh key={`tool-pupil-right-${index}`} position={[pos[0] + 0.012, pos[1], pos[2]] as [number, number, number]} castShadow>
              <sphereGeometry args={[0.012, 10, 10]} />
              <meshStandardMaterial
                color="#1f1a16"
                emissive={isHovered ? color : '#000000'}
                emissiveIntensity={isHovered ? 0.12 : 0}
              />
            </mesh>
          ))}
        </group>
      );

    case 'projection-screen':
      return (
        <group scale={scale} position={[0, elevationY, 0]}>
          {/* Soft shadow */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.15, 0.76, 1]}>
            <circleGeometry args={[0.92, 24]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={isHovered ? 0.24 : 0.12}
              depthWrite={false}
            />
          </mesh>

          {/* Robot head */}
          <mesh position={[0, 1.62, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.86, 0.72, 0.54]} />
            <meshStandardMaterial color="#d8eaf1" roughness={0.52} metalness={0.18} />
            <BorderGlow visible={isHovered} />
          </mesh>

          {/* Robot spring antenna */}
          {Array.from({ length: 5 }).map((_, index) => (
            <mesh key={`spring-${index}`} position={[0, 2.12 + index * 0.08, 0]} castShadow>
              <torusGeometry args={[0.18, 0.015, 8, 18]} />
              <meshStandardMaterial color="#555" metalness={0.85} roughness={0.26} />
            </mesh>
          ))}

          {/* Eyes */}
          {[-0.22, 0.22].map((xPos, index) => (
            <mesh key={`eye-${index}`} position={[xPos, 1.72, 0.29]} castShadow>
              <cylinderGeometry args={[0.11, 0.11, 0.04, 24]} />
              <meshStandardMaterial color="#f8efd8" metalness={0.18} roughness={0.34} />
            </mesh>
          ))}
          {[-0.22, 0.22].map((xPos, index) => (
            <mesh key={`pupil-${index}`} position={[xPos, 1.72, 0.315]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.03, 18]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isHovered ? 0.42 : 0.24}
                roughness={0.28}
                metalness={0.08}
              />
            </mesh>
          ))}

          {/* Mouth */}
          <mesh position={[0, 1.46, 0.29]} castShadow>
            <boxGeometry args={[0.32, 0.1, 0.04]} />
            <meshStandardMaterial color="#c64b3a" roughness={0.5} metalness={0.06} />
            <BorderGlow visible={isHovered} />
          </mesh>
          {Array.from({ length: 5 }).map((_, index) => (
            <mesh key={`tooth-${index}`} position={[-0.12 + index * 0.06, 1.46, 0.318]} castShadow>
              <boxGeometry args={[0.018, 0.08, 0.02]} />
              <meshStandardMaterial color="#f6f1e5" roughness={0.62} />
            </mesh>
          ))}

          {/* Body */}
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.02, 1.16, 0.62]} />
            <meshStandardMaterial color="#d6e7ee" roughness={0.48} metalness={0.16} />
            <BorderGlow visible={isHovered} />
          </mesh>

          {/* Chest panel */}
          <mesh position={[0, 0.9, 0.33]} castShadow>
            <boxGeometry args={[0.56, 0.42, 0.04]} />
            <meshStandardMaterial color="#1f2430" roughness={0.4} metalness={0.08} />
          </mesh>
          <mesh position={[-0.14, 0.98, 0.355]} castShadow>
            <boxGeometry args={[0.12, 0.1, 0.02]} />
            <meshStandardMaterial color="#ffd04e" roughness={0.36} metalness={0.06} />
          </mesh>
          <mesh position={[0.04, 0.98, 0.355]} castShadow>
            <boxGeometry args={[0.14, 0.1, 0.02]} />
            <meshStandardMaterial color="#f04f44" roughness={0.4} metalness={0.04} />
          </mesh>
          <mesh position={[-0.14, 0.82, 0.355]} castShadow>
            <boxGeometry args={[0.12, 0.1, 0.02]} />
            <meshStandardMaterial color="#4fb0da" roughness={0.38} metalness={0.04} />
          </mesh>
          <mesh position={[0.04, 0.82, 0.355]} castShadow>
            <boxGeometry args={[0.14, 0.1, 0.02]} />
            <meshStandardMaterial color="#f6f2e8" roughness={0.66} metalness={0.02} />
          </mesh>

          {/* Arms */}
          <mesh position={[-0.74, 1.02, 0]} rotation={[0, 0, 0.48]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.72, 12]} />
            <meshStandardMaterial color="#8e9ca4" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0.74, 1.02, 0]} rotation={[0, 0, -0.48]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.72, 12]} />
            <meshStandardMaterial color="#8e9ca4" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[-1.02, 0.88, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.24, 0.46, 0.14]} />
            <meshStandardMaterial color="#2da9d7" roughness={0.46} metalness={0.12} />
            <BorderGlow visible={isHovered} />
          </mesh>
          <mesh position={[1.02, 0.88, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.24, 0.46, 0.14]} />
            <meshStandardMaterial color="#2da9d7" roughness={0.46} metalness={0.12} />
            <BorderGlow visible={isHovered} />
          </mesh>

          {/* Wind-up key */}
          <mesh position={[-0.78, 0.82, -0.14]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.28, 10]} />
            <meshStandardMaterial color="#bc8f34" metalness={0.84} roughness={0.24} />
          </mesh>
          <mesh position={[-0.92, 0.92, -0.14]} castShadow>
            <torusGeometry args={[0.08, 0.018, 10, 20]} />
            <meshStandardMaterial color="#bc8f34" metalness={0.84} roughness={0.24} />
          </mesh>
          <mesh position={[-0.92, 0.72, -0.14]} castShadow>
            <torusGeometry args={[0.08, 0.018, 10, 20]} />
            <meshStandardMaterial color="#bc8f34" metalness={0.84} roughness={0.24} />
          </mesh>

          {/* Legs */}
          <mesh position={[-0.18, 0.14, 0]} rotation={[0, 0, 0.09]} castShadow>
            <cylinderGeometry args={[0.045, 0.05, 0.78, 12]} />
            <meshStandardMaterial color="#a0adb5" metalness={0.62} roughness={0.28} />
          </mesh>
          <mesh position={[0.18, 0.14, 0]} rotation={[0, 0, -0.09]} castShadow>
            <cylinderGeometry args={[0.045, 0.05, 0.78, 12]} />
            <meshStandardMaterial color="#a0adb5" metalness={0.62} roughness={0.28} />
          </mesh>

          {/* Feet */}
          <mesh position={[-0.32, -0.28, 0.08]} castShadow receiveShadow>
            <boxGeometry args={[0.34, 0.12, 0.46]} />
            <meshStandardMaterial color="#d65241" roughness={0.5} metalness={0.06} />
          </mesh>
          <mesh position={[0.32, -0.28, 0.08]} castShadow receiveShadow>
            <boxGeometry args={[0.34, 0.12, 0.46]} />
            <meshStandardMaterial color="#d65241" roughness={0.5} metalness={0.06} />
          </mesh>
        </group>
      );

    case 'android-phone':
      return (
        <group scale={scale} position={[0, elevationY, 0]}>
          {/* Soft shadow */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.2, 0.85, 1]}>
            <circleGeometry args={[0.58, 22]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={isHovered ? 0.34 : 0.18}
              depthWrite={false}
            />
          </mesh>

          {/* Front easel legs */}
          <mesh position={[-0.28, 0.58, 0]} rotation={[0, 0, 0.12]} castShadow>
            <boxGeometry args={[0.08, 1.58, 0.08]} />
            <meshStandardMaterial color="#ead7b4" roughness={0.72} metalness={0.04} />
          </mesh>
          <mesh position={[0.28, 0.58, 0]} rotation={[0, 0, -0.12]} castShadow>
            <boxGeometry args={[0.08, 1.58, 0.08]} />
            <meshStandardMaterial color="#ead7b4" roughness={0.72} metalness={0.04} />
          </mesh>

          {/* Rear support */}
          <mesh position={[0, 0.72, -0.26]} rotation={[0.22, 0, 0]} castShadow>
            <boxGeometry args={[0.08, 1.44, 0.08]} />
            <meshStandardMaterial color="#e2cdab" roughness={0.72} metalness={0.04} />
          </mesh>

          {/* Cross braces */}
          <mesh position={[0, 0.32, 0]} castShadow>
            <boxGeometry args={[0.68, 0.08, 0.08]} />
            <meshStandardMaterial color="#ead7b4" roughness={0.72} metalness={0.04} />
          </mesh>
          <mesh position={[0, 1.08, 0]} castShadow>
            <boxGeometry args={[0.78, 0.08, 0.08]} />
            <meshStandardMaterial color="#ead7b4" roughness={0.72} metalness={0.04} />
          </mesh>

          {/* Canvas support shelf */}
          <mesh position={[0, 0.82, 0.05]} castShadow>
            <boxGeometry args={[0.92, 0.08, 0.12]} />
            <meshStandardMaterial color="#eddcbe" roughness={0.66} metalness={0.04} />
          </mesh>

          {/* Canvas board */}
          <mesh position={[0, 1.36, 0.05]} castShadow receiveShadow>
            <boxGeometry args={[0.92, 1.18, 0.08]} />
            <meshStandardMaterial color="#fbf9f3" roughness={0.92} metalness={0.02} />
            <BorderGlow visible={isHovered} />
          </mesh>

          {/* Top clamp */}
          <mesh position={[0, 2.02, 0.08]} castShadow>
            <boxGeometry args={[0.2, 0.12, 0.14]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isHovered ? 0.18 : 0.06}
              roughness={0.48}
              metalness={0.08}
            />
            <BorderGlow visible={isHovered} color="#fff0c6" />
          </mesh>
          <mesh position={[0, 2.14, 0.08]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.22, 12]} />
            <meshStandardMaterial
              color="#ead7b4"
              roughness={0.66}
              metalness={0.04}
            />
          </mesh>
        </group>
      );

    case 'director-chair':
      return (
        <group scale={scale} position={[0, elevationY, 0]}>
          {/* Soft shadow */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.35, 0.92, 1]}>
            <circleGeometry args={[0.62, 24]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={isHovered ? 0.34 : 0.18}
              depthWrite={false}
            />
          </mesh>

          {/* Winners podium blocks */}
          <mesh position={[-0.74, 0.36, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.72, 0.72, 0.68]} />
            <meshStandardMaterial color="#f7f2e8" roughness={0.78} metalness={0.02} />
            <BorderGlow visible={isHovered} />
          </mesh>
          <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.92, 1.16, 0.72]} />
            <meshStandardMaterial color="#fffaf1" roughness={0.74} metalness={0.02} />
            <BorderGlow visible={isHovered} color="#ffe7b2" />
          </mesh>
          <mesh position={[0.74, 0.22, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.72, 0.44, 0.68]} />
            <meshStandardMaterial color="#f4eee3" roughness={0.8} metalness={0.02} />
            <BorderGlow visible={isHovered} />
          </mesh>

          {/* Top trim for a more ceremonial feel */}
          <mesh position={[0, 1.17, 0]} castShadow>
            <boxGeometry args={[0.98, 0.05, 0.76]} />
            <meshStandardMaterial color="#d4b06a" roughness={0.34} metalness={0.24} />
          </mesh>

          {/* Front numbers */}
          <Text
            position={[-0.74, 0.28, 0.35]}
            fontSize={0.28}
            color="#111111"
            anchorX="center"
            anchorY="middle"
          >
            2
          </Text>
          <Text
            position={[0, 0.43, 0.37]}
            fontSize={0.44}
            color="#111111"
            anchorX="center"
            anchorY="middle"
          >
            1
          </Text>
          <Text
            position={[0.74, 0.15, 0.35]}
            fontSize={0.28}
            color="#111111"
            anchorX="center"
            anchorY="middle"
          >
            3
          </Text>
        </group>
      );

    case 'exit-door':
      return (
        <group scale={scale} position={[0, elevationY, 0]}>
          {/* Soft shadow */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.42, 1, 1]}>
            <circleGeometry args={[0.8, 24]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={isHovered ? 0.34 : 0.18}
              depthWrite={false}
            />
          </mesh>

          {/* Table top */}
          <mesh position={[0, 0.84, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.94, 0.98, 0.08, 40]} />
            <meshStandardMaterial color="#7a5030" roughness={0.48} metalness={0.08} />
            <BorderGlow visible={isHovered} color="#ffe3b4" />
          </mesh>

          {/* Table apron */}
          <mesh position={[0, 0.74, 0]} castShadow>
            <cylinderGeometry args={[0.74, 0.78, 0.12, 32]} />
            <meshStandardMaterial color="#6f482a" roughness={0.52} metalness={0.06} />
          </mesh>

          {/* Table legs */}
          {[
            [-0.52, 0.38, -0.52],
            [0.52, 0.38, -0.52],
            [-0.52, 0.38, 0.52],
            [0.52, 0.38, 0.52],
          ].map((position, index) => (
            <mesh key={`contact-table-leg-${index}`} position={position as [number, number, number]} castShadow>
              <cylinderGeometry args={[0.055, 0.075, 0.78, 16]} />
              <meshStandardMaterial color="#4f301b" roughness={0.58} metalness={0.05} />
            </mesh>
          ))}

          {/* Phone base */}
          <mesh position={[0, 1.02, 0.03]} castShadow receiveShadow>
            <boxGeometry args={[0.98, 0.42, 0.72]} />
            <meshStandardMaterial
              color="#9a6e42"
              roughness={0.56}
              metalness={0.1}
            />
            <BorderGlow visible={isHovered} color="#ffe3b4" />
          </mesh>

          {/* Phone front slope */}
          <mesh position={[0, 1.14, 0.18]} rotation={[-0.48, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.9, 0.26, 0.52]} />
            <meshStandardMaterial color="#a77a4d" roughness={0.52} metalness={0.08} />
            <BorderGlow visible={isHovered} color="#ffe3b4" />
          </mesh>

          {/* Dial plate */}
          <mesh position={[0, 1.03, 0.39]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.06, 28]} />
            <meshStandardMaterial color="#efe3c7" roughness={0.4} metalness={0.14} />
          </mesh>
          <mesh position={[0, 1.03, 0.425]} castShadow>
            <torusGeometry args={[0.13, 0.03, 12, 30]} />
            <meshStandardMaterial color="#dbc28b" roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh position={[0, 1.03, 0.455]} castShadow>
            <cylinderGeometry args={[0.042, 0.042, 0.032, 18]} />
            <meshStandardMaterial color="#f4ead2" roughness={0.44} metalness={0.08} />
          </mesh>

          {/* Dial holes */}
          {Array.from({ length: 8 }).map((_, index) => {
            const angle = -Math.PI * 0.15 + index * ((Math.PI * 1.3) / 7);
            return (
              <mesh
                key={`dial-hole-${index}`}
                position={[
                  Math.cos(angle) * 0.11,
                  1.03 + Math.sin(angle) * 0.11,
                  0.47,
                ]}
                castShadow
              >
                <cylinderGeometry args={[0.022, 0.022, 0.024, 14]} />
                <meshStandardMaterial color="#5b4028" roughness={0.58} metalness={0.06} />
              </mesh>
            );
          })}

          {/* Phone top block */}
          <mesh position={[0, 1.34, -0.02]} castShadow receiveShadow>
            <boxGeometry args={[0.72, 0.2, 0.26]} />
            <meshStandardMaterial color="#9a6e42" roughness={0.54} metalness={0.08} />
          </mesh>

          {/* Receiver handles */}
          <mesh position={[-0.34, 1.48, -0.02]} rotation={[0, 0, -0.5]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.34, 16]} />
            <meshStandardMaterial color="#d7c39b" roughness={0.42} metalness={0.18} />
          </mesh>
          <mesh position={[0.34, 1.48, -0.02]} rotation={[0, 0, 0.5]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.34, 16]} />
            <meshStandardMaterial color="#d7c39b" roughness={0.42} metalness={0.18} />
          </mesh>
          <mesh position={[0, 1.63, -0.02]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
            <capsuleGeometry args={[0.07, 0.48, 8, 16]} />
            <meshStandardMaterial color="#7c552f" roughness={0.5} metalness={0.08} />
            <BorderGlow visible={isHovered} color="#ffe3b4" />
          </mesh>

          {/* Gold receiver caps */}
          {[-0.56, 0.56].map((xPos) => (
            <mesh key={`receiver-cap-${xPos}`} position={[xPos, 1.64, -0.02]} castShadow>
              <cylinderGeometry args={[0.11, 0.09, 0.16, 18]} />
              <meshStandardMaterial color="#d7bf8b" roughness={0.34} metalness={0.28} />
            </mesh>
          ))}

          {/* Hook switches */}
          {[-0.24, 0.24].map((xPos) => (
            <mesh key={`hook-${xPos}`} position={[xPos, 1.44, -0.02]} castShadow>
              <cylinderGeometry args={[0.035, 0.035, 0.14, 12]} />
              <meshStandardMaterial color="#ccb07a" roughness={0.34} metalness={0.24} />
            </mesh>
          ))}

          {/* Coiled cord */}
          <mesh position={[-0.46, 1.1, -0.24]} rotation={[0.24, 0.12, Math.PI / 2]} castShadow>
            <torusKnotGeometry args={[0.18, 0.018, 72, 10, 8, 3]} />
            <meshStandardMaterial color="#24201c" roughness={0.74} metalness={0.06} />
          </mesh>
        </group>
      );

    default:
      return (
        <group scale={scale} position={[0, elevationY, 0]}>
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.3, 16]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={0.2}
              depthWrite={false}
            />
          </mesh>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={color} />
            <BorderGlow visible={isHovered} />
          </mesh>
        </group>
      );
  }
};

export const StageProp: React.FC<StagePropProps> = ({ propData, onClick }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { smoothX, smoothY, setHovering } = useSpotlightStore();

  // Base position stored separately from animation
  const basePosition = useMemo(() => propData.position, [propData.position]);
  const baseRotation = useMemo(
    () => propData.rotation ?? [0, 0, 0],
    [propData.rotation]
  );

  // Gentle float animation with reduced intensity when hovered
  useFrame((state) => {
    if (!meshRef.current) return;

    const propScreenX = (basePosition[0] + 10) / 20 * window.innerWidth;
    const propScreenY = (basePosition[2] + 5) / 10 * window.innerHeight;
    const distance = Math.sqrt(
      Math.pow(smoothX - propScreenX, 2) + Math.pow(smoothY - propScreenY, 2)
    );
    const isNear = distance < 190;

    if (propData.id === 'projection-screen') {
      const sway = Math.sin(state.clock.elapsedTime * 1.15) * (isHovered ? 0.06 : 0.035);
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        basePosition[1] + (isNear ? 0.04 : 0),
        0.08
      );
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        sway,
        0.08
      );
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.04;
      return;
    }

    // Reduced float when hovered (more stable for interaction)
    const floatIntensity = isHovered ? 0.015 : 0.04;
    const floatY = Math.sin(state.clock.elapsedTime * 0.5) * floatIntensity;
    const hoverLift = isNear ? 0.08 : 0;

    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      basePosition[1] + floatY + hoverLift,
      0.08
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      baseRotation[2],
      0.08
    );
  });

  const handlePointerOver = () => {
    setIsHovered(true);
    setHovering(true, propData.id);
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    setHovering(false, null);
  };

  return (
    <Float
      speed={2}
      rotationIntensity={0.1}
      floatIntensity={propData.id === 'microphone' ? 0 : 0.2}
      enabled={!isHovered && propData.id !== 'microphone'}
    >
      <group
        ref={meshRef}
        position={basePosition}
        rotation={baseRotation as [number, number, number]}
        scale={propData.scale as [number, number, number]}
        onClick={(event) => {
          event.stopPropagation();
          onClick();
        }}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <PropGeometry propId={propData.id} color={propData.color} isHovered={isHovered} />

        {/* Label when hovered */}
        {isHovered && (
          <Text
            position={[0, 1.5, 0]}
            fontSize={0.15}
            color="#fff"
            anchorX="center"
            anchorY="middle"
          >
            {propData.name}
          </Text>
        )}
      </group>
    </Float>
  );
};
