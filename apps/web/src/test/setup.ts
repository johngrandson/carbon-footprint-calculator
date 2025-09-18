import '@testing-library/jest-dom';

// Suppress Three.js multiple instance warning in tests
const originalWarn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (typeof message === 'string' && message.includes('Multiple instances of Three.js being imported')) {
    return; // Suppress this specific warning
  }
  originalWarn.apply(console, args);
};