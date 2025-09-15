// Fruit models configuration with paths and individual sizes
export const FRUIT_MODELS = [
  {
    path: '/orange.glb',
    name: 'orange',
    geometryPath: 'Cylinder_Material001_0.geometry',
    materialPath: 'Material.001',
    baseScale: 0.8,
    scaleVariation: 0.4
  },
  {
    path: '/strawberry.glb',
    name: 'strawberry',
    geometryPath: 'Cube_Material001_0.geometry',
    materialPath: 'Material.001',
    baseScale: 1,
    scaleVariation: 0.1
  },
  {
    path: '/watermelon.glb',
    name: 'watermelon',
    geometryPath: 'Watermelon_Material001_0.geometry',
    materialPath: 'Material.001',
    baseScale: 0.8,
    scaleVariation: 0.2
  }
] as const;

export type FruitModel = typeof FRUIT_MODELS[number];