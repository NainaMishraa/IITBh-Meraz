import React, { useState } from 'react';
import { useOSStore } from '../store/osStore';

export function LoginDialog() {
  const login = useOSStore((s) => s.login);
  const [user, setUser] = useState('satoshi');
  const [pass, setPass] = useState('');
  const [wrong, setWrong] = useState(false);
  const [cancelCount, setCancelCount] = useState(0);
  const [logging, setLogging] = useState(false);

  const doLogin = () => {
    if (logging) return;
    setLogging(true);
    setTimeout(login, 800);
  };

  const doCancel = () => {
    const next = cancelCount + 1;
    setCancelCount(next);
    if (next >= 2) {
      // "Cancel still logs in" — after pressing cancel twice, just boot in
      setTimeout(login, 400);
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 2000);
    }
  };

  return (
    <div style={{
      background: '#008080',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '0',
    }}>
      {/* Classic Win98 dialog box */}
      <div style={{
        background: '#c0c0c0',
        border: '2px solid',
        borderColor: '#fff #808080 #808080 #fff',
        width: '320px',
        boxShadow: '4px 4px 0 #000',
      }}>
        {/* Title bar */}
        <div style={{
          background: 'linear-gradient(to right, #000080, #1084d0)',
          color: '#fff',
          padding: '3px 4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
        }}>
          <span>Enter Network Password</span>
          <button style={{
            background: '#c0c0c0',
            border: '1px solid',
            borderColor: '#fff #808080 #808080 #fff',
            width: '16px', height: '14px',
            fontSize: '10px', cursor: 'pointer',
            lineHeight: '12px', padding: 0,
          }} onClick={doCancel}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
            {/* Computer icon */}
            <div style={{ fontSize: '32px', lineHeight: 1 }}>💻</div>
            <div>
              <div style={{ marginBottom: '4px' }}>
                Connect to <strong>SATOSHI-PC</strong>
              </div>
              <div style={{ color: '#444', fontSize: '11px' }}>
                {cancelCount === 1 ? '⚠ One more cancel and we\'re logging in anyway.' : 'Enter your network password.'}
              </div>
            </div>
          </div>

          {wrong && (
            <div style={{ color: 'red', fontSize: '11px', marginBottom: '8px' }}>
              Incorrect password. (Hint: there is no correct password. Try Cancel.)
            </div>
          )}

          {logging && (
            <div style={{ color: '#000080', fontSize: '11px', marginBottom: '8px' }}>
              Logging in... (cryptographically, of course)
            </div>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px' }}>
            <tbody>
              <tr style={{ marginBottom: '8px' }}>
                <td style={{ paddingBottom: '6px', width: '90px' }}>User name:</td>
                <td style={{ paddingBottom: '6px' }}>
                  <input
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    style={{
                      width: '160px', height: '20px',
                      border: '2px inset #808080',
                      fontFamily: 'Arial', fontSize: '12px',
                      padding: '1px 3px',
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>Password:</td>
                <td>
                  <input
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="(leave blank)"
                    onKeyDown={(e) => e.key === 'Enter' && doLogin()}
                    style={{
                      width: '160px', height: '20px',
                      border: '2px inset #808080',
                      fontFamily: 'Arial', fontSize: '12px',
                      padding: '1px 3px',
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <button
              onClick={doLogin}
              style={{
                width: '72px', height: '23px',
                background: '#c0c0c0',
                border: '2px solid',
                borderColor: '#fff #808080 #808080 #fff',
                fontFamily: 'Arial', fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              OK
            </button>
            <button
              onClick={doCancel}
              style={{
                width: '72px', height: '23px',
                background: '#c0c0c0',
                border: '2px solid',
                borderColor: '#fff #808080 #808080 #fff',
                fontFamily: 'Arial', fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>

          <div style={{ marginTop: '10px', fontSize: '10px', color: '#666', textAlign: 'center' }}>
            💡 Tip: Press Cancel. It still works. This is a metaphor.
          </div>
        </div>
      </div>

      <div style={{ color: '#aaffaa', fontSize: '11px', marginTop: '12px', fontFamily: 'Arial' }}>
        Windows 98 Second Edition — SATOSHI-PC
      </div>
    </div>
  );
}
