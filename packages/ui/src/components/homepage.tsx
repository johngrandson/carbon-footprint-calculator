'use client';

import { Lighting, LIGHTING_PRESETS } from './lighting';
import { Model } from './model';
import { Scene } from './scene';

export function Homepage({ className }: { className?: string }) {
  return (
    <Scene
      className={className}
      backgroundColor="#000000"
      environment="city"
    >
      <Lighting lights={LIGHTING_PRESETS.base} />
      <Model
        src="/earth.glb"
        scale={1}
        position={[0, 0, 0]}
        rotationSpeed={0.5}
        geometryPath="Sphere_Material002_0.geometry"
        materialPath="Material.003"
      />
    </Scene>
  );
}
