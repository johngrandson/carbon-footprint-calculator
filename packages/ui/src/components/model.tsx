'use client';

import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

interface ModelProps {
  src: string;
  scale?: number;
  position?: [number, number, number];
  rotationSpeed?: number;
  geometryPath?: string;
  materialPath?: string;
}

export function Model({
  src,
  scale = 1,
  position = [0, 0, 0],
  rotationSpeed = 0.01,
  geometryPath = 'Sphere_Material002_0.geometry',
  materialPath = 'Material.003'
}: ModelProps) {
  const ref = useRef<any>(null);
  const { nodes, materials } = useGLTF(src);

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * rotationSpeed;
    }
  });

  const geometry = (nodes as any)[geometryPath.split('.')[0]]?.geometry;
  const material = (materials as any)[materialPath];

  if (!geometry || !material) {
    return null;
  }

  return React.createElement('mesh', {
    ref,
    geometry,
    material,
    scale,
    position
  });
}