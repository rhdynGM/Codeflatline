import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/GameProvider';

export default function MainTerminal() {
  const game = useGame();
  const [logs, setLogs] = useState<Array<{id:string, text:string, level:string, ts:number}>>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // subscribe to real-time logs via GameProvider.subscribeLogs
    const unsub = game.subscribeLogs((item: any) => {
      // item has shape { id, level, text, ts } from logger
      setLogs((prev) => {
        const next = prev.concat([{ id: item.id, text: item.text, level: item.level, ts: item.ts }]);
        // keep last 200 lines max
        return next.slice(-200);
      });
    });
    return () => unsub && unsub();
  }, [game]);

  const doTestAttack = async () => {
    if (busy) return;
    setBusy(true);
    try {
      // trigger engine attack - this calls gameEngine.attackTarget
      const res = await game.attack('target-quicktest');
      // engine already logs results via logger; optionally show immediate feedback
      if (res && res.success) {
        // feedback handled by logger -> UI will update automatically
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const state = game.state;
  const player = state?.player;

  return (
    <div style={{ padding: 12, fontFamily: 'monospace', color: '#a6ff00', background: 'linear-gradient(#050505,#0d0d0d)', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div>
          <strong style={{ color: '#00ffff' }}>{player?.username ?? 'anonymous'}</strong>
          <span style={{ marginLeft: 12, opacity: 0.8 }}>Credits: {player?.credits ?? '-'}</span>
          <span style={{ marginLeft: 12, opacity: 0.8 }}>Fragments: {player?.fragments ?? '-'}</span>
        </div>
        <div>
          <button onClick={doTestAttack} disabled={busy} style={{ background: '#00ffff', color: '#000', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: busy ? 'not-allowed' : 'pointer' }}>
            {busy ? 'Launching...' : 'Launch Test Attack'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, height: 'calc(100% - 60px)' }}>
        <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ fontSize: 12, color: '#ff00ff', marginBottom: 6 }}>TERMINAL LOG</div>
          {logs.map((l) => (
            <div key={l.id} style={{ fontSize: 12, marginBottom: 2, opacity: 0.95 }}>
              <span style={{ color: '#777', marginRight: 8 }}>{new Date(l.ts).toLocaleTimeString()}</span>
              <span dangerouslySetInnerHTML={{ __html: l.text }} />
            </div>
          ))}
        </div>

        <div style={{ width: 260, background: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#00ffff', marginBottom: 8 }}>SERVER STATUS</div>
          <div style={{ fontSize: 13 }}>CPU: {player?.server?.cpu}%</div>
          <div style={{ fontSize: 13 }}>RAM: {player?.server?.ram}%</div>
          <div style={{ fontSize: 13 }}>Firewall: {player?.server?.firewall}%</div>
          <div style={{ fontSize: 13 }}>Load: {player?.server?.load}%</div>
          <div style={{ height: 10 }} />
          <div style={{ fontSize: 12, color: '#ffb86b' }}>BOTS</div>
          <ul style={{ paddingLeft: 16 }}>
            {player?.bots?.map((b:any) => <li key={b.id} style={{ fontSize: 12 }}>{b.id} — {b.status}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
