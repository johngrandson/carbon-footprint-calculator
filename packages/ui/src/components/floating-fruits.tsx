'use client';

import { FRUIT_MODELS } from './config';
import { FloatingFruit } from './floating-fruit';
import { Lighting, LIGHTING_PRESETS } from './lighting';
import { Scene } from './scene';

interface FloatingFruitsProps {
  className?: string;
  speed?: number;
  count?: number;
  depth?: number;
  backgroundColor?: string;
  environment?: 'sunset' | 'dawn' | 'forest' | 'city';
}

export function FloatingFruits({
  className,
  speed = 1,
  count = 15,
  depth = 20,
  backgroundColor = '#ffbf40',
  environment = 'sunset'
}: FloatingFruitsProps) {
  return (
    <Scene
      className={className}
      backgroundColor={backgroundColor}
      environment={environment}
      camera={{ position: [0, 0, 10], fov: 10, near: 10, far: depth + 50 }}
      postProcessing={{
        target: [0, 0, 60],
        focalLength: 0.2,
        bokehScale: 10,
        height: 1000
      }}
    >
      <Lighting lights={LIGHTING_PRESETS.base} />

      {/* Generate floating fruits */}
      {Array.from({ length: count }, (_, i) => {
        const fruitIndex = Math.floor(Math.random() * FRUIT_MODELS.length);
        const z = (i / count) * depth;
        return (
          <FloatingFruit
            key={i}
            fruitConfig={FRUIT_MODELS[fruitIndex]}
            z={z}
            speed={speed}
          />
        );
      })}
    </Scene>
  );
}
