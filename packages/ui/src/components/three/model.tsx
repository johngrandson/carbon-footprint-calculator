'use client';

import { createElement, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

interface ModelProps {
  src: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: {
    speed?: number;
    axis?: [number, number, number];
  };
  geometryPath?: string;
  materialPath?: string;
}

export function Model({
  src,
  scale = 1,
  position = [0, 0, 0],
  rotation = { speed: 15, axis: [0, 0, 1] },
  geometryPath = 'Sphere_Material002_0.geometry',
  materialPath = 'Material.003'
}: ModelProps) {
  const ref = useRef<Mesh>(null!);
  const { nodes, materials } = useGLTF(src);
  const [rotationValue, setRotationValue] = useState(Math.random() * Math.PI);

  useFrame((_, dt) => {
    if (rotation.speed && rotation.axis) {
      const newRotation = rotationValue + dt / rotation.speed;
      setRotationValue(newRotation);
      if (ref.current) {
        const [x, y, z] = rotation.axis;
        ref.current.rotation.set(
          x !== 0 ? (x === 1 ? newRotation : x) : 0,
          y !== 0 ? (y === 1 ? newRotation : y) : 0,
          z !== 0 ? (z === 1 ? newRotation : z) : 0
        );
      }
    }
  });

  return createElement('mesh', {
    ref,
    geometry: (nodes as any)[geometryPath.split('.')[0]]?.geometry,
    material: (materials as any)[materialPath],
    scale,
    position
  });
}