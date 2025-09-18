import { uiConfig } from '@workspace/vitest-config/ui';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  uiConfig,
  defineConfig({
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
        '~': new URL('./', import.meta.url).pathname,
      }
    },
    test: {
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      coverage: {
        enabled: false
      }
    },
  })
);