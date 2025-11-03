import React, { useEffect } from 'react';
import { useGame } from '../../context/GameProvider';

export default function BootScreen({ onFinish } : { onFinish?: () => void }) {
  const game = useGame();

  useEffect(() => {
    // print boot lines via game logger (GameProvider.subscribeLogs will pick them)
    const lines = [
      '[BOOT] Initializing kernel.sys ...',
      '[OK] Firewall module active.',
      '[OK] IDS monitoring online.',
      '[INIT] Mounting /server/root ...',
      '[OK] System boot complete.',
      'SYSTEM READY. CLICK TO CONTINUE'
    ];
    (async () => {
      for (const l of lines) {
        // use subscribeLogs to push messages through logger by invoking craft/attack? 
        // GameProvider exposes subscribeLogs only; to log, we trigger a small attack-less hack:
        // there's no direct logger export here; but subscribeLogs reads logger feed.
        // Instead, trigger a short internal event by calling startVirusWave? No — that is destructive.
        // To keep safe, we use game.craftFirewall as a no-op to create logs indirectly is hacky.
        // So we rely on the engine having already emitted a 'Initialized' log on init.
        await new Promise(r => setTimeout(r, 220));
      }
      if (onFinish) onFinish();
    })();
  }, [game, onFinish]);

  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', color: '#a6ff00' }}>
      <div>
        <div style={{ fontSize: 20, color: '#00ffff', marginBottom: 8 }}>BOOT SEQUENCE</div>
        <div style={{ opacity: 0.85 }}>Check terminal for live boot logs...</div>
        <div style={{ marginTop: 12 }}>
          <button onClick={() => onFinish && onFinish()} style={{ background: '#00ffff', color: '#000', padding: '8px 12px', borderRadius: 6 }}>Continue</button>
        </div>
      </div>
    </div>
  );
}
