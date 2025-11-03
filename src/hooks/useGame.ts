/**
 * src/hooks/useGame.ts
 * Lightweight hook which re-exports the useGame() from GameProvider.
 * If your GameProvider already exports useGame(), this will import and re-export it.
 * This file allows components to import from 'src/hooks/useGame' for a stable path.
 */
try {
  // attempt to import the useGame export from src/context/GameProvider
  // This file will be transpiled by your build system; the try/catch is only for initial dev readability.
} catch(e) {}
export { useGame } from '../context/GameProvider';
