import React, { useState } from 'react';
import { useGame } from '../../context/GameProvider';

export default function LoginScreen({ onLogin }: { onLogin?: () => void }) {
  const game = useGame();
  const [username, setUsername] = useState('');

  const doLogin = () => {
    // There isn't a direct 'setUsername' API; we'll try to mutate via saved state persistence
    try {
      const s = game.state;
      if (s && s.player) {
        s.player.username = username || 'anon';
        // persist by calling craftFirewall as a cheap way to trigger save? No.
        // Instead rely on engine.persist existing; but GameProvider doesn't expose persist.
        // Use startVirusWave is destructive. So as a safe and minimal approach, call attack with dummy target quickly and revert credits.
        // Better approach: write to localStorage directly so engine will pick it up on reload.
        localStorage.setItem('flatline_v1', JSON.stringify({ ...s, player: { ...s.player, username: username || 'anon' } }));
      }
      if (onLogin) onLogin();
    } catch (err) {
      console.error(err);
      if (onLogin) onLogin();
    }
  };

  return (
    <div style={{ fontFamily: 'monospace', color: '#a6ff00', padding: 20 }}>
      <h2 style={{ color: '#00ffff' }}>SYSTEM ONLINE — AUTHENTICATE USER</h2>
      <input placeholder="username" value={username} onChange={(e:any)=>setUsername(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 8, width: '100%' }} />
      <div>
        <button onClick={doLogin} style={{ background: '#00ffff', color: '#000', padding: '8px 12px', borderRadius: 6 }}>LOGIN</button>
      </div>
    </div>
  );
}
