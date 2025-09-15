'use client';

import React, { useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import type { FruitModel } from './config/fruit-models';

interface FloatingFruitProps {
  fruitConfig: FruitModel;
  z: number;
  speed: number;
}

export function FloatingFruit({ fruitConfig, z, speed }: FloatingFruitProps) {
  const ref = useRef<any>(null);
  const { viewport, camera } = useThree();
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, -z]);
  const gltf = useGLTF(fruitConfig.path) as any;

  // Random initial state
  const [data] = useState(() => ({
    y: THREE.MathUtils.randFloatSpread(height * 2),
    x: THREE.MathUtils.randFloatSpread(2),
    rotationSpeed: THREE.MathUtils.randFloat(0.01, 0.7),
    scale:
      fruitConfig.baseScale +
      THREE.MathUtils.randFloatSpread(fruitConfig.scaleVariation)
  }));

  useFrame((state, dt) => {
    if (!ref.current || dt > 0.1) return;

    // Update position
    data.y += dt * speed;
    ref.current.position.set(data.x * width, data.y, -z);

    // Spinning rotation on multiple axes
    ref.current.rotation.x += dt * data.rotationSpeed;
    ref.current.rotation.y += dt * data.rotationSpeed * 0.8;
    ref.current.rotation.z += dt * data.rotationSpeed * 1.2;

    // Reset when off screen
    if (data.y > height * 2) {
      data.y = -height * 2;
    }
  });

  // Get geometry and material from GLTF
  const geometry = gltf.nodes[fruitConfig.geometryPath.split('.')[0]]?.geometry;
  const material = gltf.materials[fruitConfig.materialPath];

  if (!geometry || !material) {
    return null;
  }

  return React.createElement('mesh', {
    ref,
    geometry,
    material,
    scale: data.scale
  });
}
