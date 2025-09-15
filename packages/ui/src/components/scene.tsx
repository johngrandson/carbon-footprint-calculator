'use client';

import { createElement, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { DepthOfField, EffectComposer } from '@react-three/postprocessing';

type EnvironmentPreset =
  | 'city'
  | 'apartment'
  | 'dawn'
  | 'forest'
  | 'lobby'
  | 'night'
  | 'park'
  | 'studio'
  | 'sunset'
  | 'warehouse'
  | undefined;

interface SceneProps {
  className?: string;
  backgroundColor?: string;
  environment?: EnvironmentPreset;
  camera?: {
    position?: [number, number, number];
    fov?: number;
    near?: number;
    far?: number;
  };
  postProcessing?: {
    target?: [number, number, number];
    focalLength?: number;
    bokehScale?: number;
    height?: number;
  };
  children: ReactNode;
}

export function Scene({
  className,
  backgroundColor = '#000000',
  environment = 'city',
  camera = {
    position: [0, 0, 10],
    fov: 20,
    near: 0.01,
    far: 150
  },
  postProcessing = {
    target: [0, 0, 30],
    focalLength: 0.4,
    bokehScale: 1,
    height: 700
  },
  children
}: SceneProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className} />;
  }

  return (
    <div className={className}>
      <Canvas
        flat
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
        camera={camera}
      >
        {
          createElement('color', {
            attach: 'background',
            args: [backgroundColor]
          }) as any
        }

        {children}

        <Environment preset={environment} />

        <EffectComposer enableNormalPass={false} multisampling={0}>
          <DepthOfField {...postProcessing} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
