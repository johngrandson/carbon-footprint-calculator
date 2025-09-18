'use client';

import { Lighting, LIGHTING_PRESETS } from './lighting';
import { Model } from './model';
import { Scene } from './scene';

interface EnergyBackgroundProps {
  className?: string;
}

export function EnergyBackground({ className }: EnergyBackgroundProps) {
  return (
    <Scene
      className={className}
      backgroundColor="#1a1a2e"
      environment="city"
      camera={{ position: [0, 0, 8], fov: 15, near: 1, far: 100 }}
      postProcessing={{
        target: [0, 0, 0],
        focalLength: 0.1,
        bokehScale: 5,
        height: 800
      }}
    >
      <Lighting lights={LIGHTING_PRESETS.base} />

      {/* Main Earth model with energy theme */}
      <Model
        src="/earth.glb"
        scale={1.2}
        position={[0, 0, 0]}
        rotationSpeed={0.3}
        geometryPath="Sphere_Material002_0.geometry"
        materialPath="Material.003"
      />
    </Scene>
  );
}