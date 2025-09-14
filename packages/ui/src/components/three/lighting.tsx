'use client';

import { createElement } from 'react';

export interface LightConfig {
  position: [number, number, number];
  intensity: number;
  color: string;
  penumbra?: number;
  decay?: number;
}

interface LightingProps {
  lights: LightConfig[];
}

export function Lighting({ lights }: LightingProps) {
  return (
    <>
      {lights.map(
        (light, index) =>
          createElement('spotLight', {
            key: index,
            position: light.position,
            penumbra: light.penumbra ?? 1,
            decay: light.decay ?? 0,
            intensity: light.intensity,
            color: light.color
          }) as any
      )}
    </>
  );
}

// Predefined lighting presets
export const LIGHTING_PRESETS = {
  base: [
    {
      position: [10, 20, 10] as [number, number, number],
      intensity: 1.5,
      color: '#8b7355',
      penumbra: 1,
      decay: 0
    },
    {
      position: [-8, -5, 12] as [number, number, number],
      intensity: 0.8,
      color: '#6b5b47',
      penumbra: 0.9,
      decay: 0
    },
    {
      position: [0, -10, 8] as [number, number, number],
      intensity: 0.6,
      color: '#4a3c2a',
      penumbra: 0.7,
      decay: 0
    }
  ],
  clean: [
    {
      position: [10, 10, 10] as [number, number, number],
      intensity: 2,
      color: '#ffffff',
      penumbra: 0.5,
      decay: 0
    }
  ]
};
