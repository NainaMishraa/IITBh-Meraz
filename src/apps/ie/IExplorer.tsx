import React, { useState } from 'react';
import { useOSStore } from '../../store/osStore';

const FAKE_SITES: Record<string, { title: string; content: React.ReactNode }> = {
  'www.google.com': {
    title: 'Google',
    content: (
      <div style={{ textAlign: 'center', paddingTop: '60px', fontFamily: 'Arial' }}>
        <div style={{ fontSize: '40px', letterSpacing: '-1px', marginBottom: '16px' }}>
          <span style={{ color: '#4285f4' }}>G</span>
          <span style={{ color: '#ea4335' }}>o</span>
          <span style={{ color: '#fbbc05' }}>o</span>
          <span style={{ color: '#4285f4' }}>g</span>
          <span style={{ color: '#34a853' }}>l</span>
          <span style={{ color: '#ea4335' }}>e</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
          <input style={{ width: '400px', padding: '6px 12px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '2px' }} placeholder="Search the web!" />
          <button style={{ padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}>Google Search</button>
        </div>
        <div style={{ fontSize: '11px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          <strong>Beta</strong> | Web | Images | Groups | Directory | News<br/><br/>
          <em>Google is in beta. Results may be inexact. We are 2 grad students in a garage.<br/>
          Please be patient. We think we can make searching better.</em><br/><br/>
          <em style={{ color: '#888' }}>Note from Satoshi: "Found this while researching 'how to make digital money'. 
          Very clean. Very white. I respect the simplicity. 
          Thinking about using a similar aesthetic for my whitepaper."</em>
        </div>
      </div>
    ),
  },
  'www.yahoo.com': {
    title: 'Yahoo! - The Web\'s Most Popular Site',
    content: (
      <div style={{ fontFamily: 'Arial', fontSize: '12px', padding: '8px' }}>
        <div style={{ background: '#400090', color: '#fff', padding: '6px 12px', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
          Yahoo!
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ minWidth: '200px' }}>
            <strong>Yahoo! Directory</strong>
            <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
              <li>Arts & Humanities</li>
              <li>Business & Economy</li>
              <li>Computers & Internet</li>
              <li>Education</li>
              <li>Science ← <em style={{ color: '#800' }}>Satoshi checked this 47 times</em></li>
              <li>Society & Culture</li>
            </ul>
          </div>
          <div style={{ flex: 1 }}>
            <strong>Top News</strong>
            <ul style={{ margin: '4px 0', paddingLeft: '20px', fontSize: '11px' }}>
              <li>Y2K Bug: Will computers survive the year 2000?</li>
              <li>Napster: Music for free? Lawyers concerned</li>
              <li>Dot-com companies valued at infinite money</li>
              <li>Anonymous programmer sends emails about "digital coins"</li>
              <li>Tamagotchi deaths reach alarming levels</li>
            </ul>
            <div style={{ marginTop: '8px', padding: '4px', background: '#ffffd0', border: '1px solid #ccc', fontSize: '11px' }}>
              <strong>Satoshi's Browser History Note:</strong><br/>
              <em>"Visited Yahoo every day for the weather. 
              Started leaving my computer on overnight to check email. 
              The phone line being busy was the main problem with my lifestyle."</em>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  'www.altavista.com': {
    title: 'AltaVista - The most powerful and useful guide to the Net',
    content: (
      <div style={{ fontFamily: 'Arial', textAlign: 'center', padding: '20px' }}>
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00f', marginBottom: '12px' }}>AltaVista</div>
        <div style={{ fontSize: '11px', color: '#666', marginBottom: '16px' }}>Search 100 million web pages!</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
          <input style={{ width: '360px', padding: '4px', fontSize: '13px', border: '2px inset #808080' }} placeholder="What are you searching for?" defaultValue="how to download more RAM" />
          <button style={{ padding: '4px 10px', cursor: 'pointer' }}>Search!</button>
        </div>
        <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left', fontSize: '11px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Satoshi's Search History (recovered from cache):</div>
          <div style={{ color: '#0000cc', textDecoration: 'underline', cursor: 'pointer' }}>how to download more RAM</div>
          <div style={{ color: '#0000cc', textDecoration: 'underline', cursor: 'pointer' }}>is math legal in the united states</div>
          <div style={{ color: '#0000cc', textDecoration: 'underline', cursor: 'pointer' }}>byzantine generals problem solution</div>
          <div style={{ color: '#0000cc', textDecoration: 'underline', cursor: 'pointer' }}>how to be anonymous online</div>
          <div style={{ color: '#0000cc', textDecoration: 'underline', cursor: 'pointer' }}>what is money actually</div>
          <div style={{ color: '#0000cc', textDecoration: 'underline', cursor: 'pointer' }}>can you make money without banks</div>
          <div style={{ color: '#0000cc', textDecoration: 'underline', cursor: 'pointer' }}>cryptography for beginners</div>
          <div style={{ color: '#0000cc', textDecoration: 'underline', cursor: 'pointer' }}>pizza places that accept unusual payment</div>
          <div style={{ color: '#0000cc', textDecoration: 'underline', cursor: 'pointer' }}>how many zeroes in 21 million</div>
        </div>
      </div>
    ),
  },
  'www.bitcoin.org': {
    title: '404 Not Found',
    content: (
      <div style={{ fontFamily: 'monospace', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', color: '#800' }}>404</div>
        <div style={{ fontSize: '20px', marginTop: '8px' }}>Domain Not Found</div>
        <div style={{ marginTop: '16px', fontSize: '13px', color: '#444', maxWidth: '500px', margin: '20px auto' }}>
          <strong>Error:</strong> bitcoin.org — This domain has not been invented yet.<br/><br/>
          The concept it represents is also technically not invented yet,<br/>
          although one person is working on it quite seriously.<br/><br/>
          Check back in approximately 2008.<br/><br/>
          <em style={{ color: '#666' }}>Server: Apache/1998<br/>
          Error 404: Domain exists only in one person's mind currently.<br/>
          That person is not telling us who they are.</em>
        </div>
      </div>
    ),
  },
  'www.geocities.com/satoshi_home': {
    title: 'Satoshi\'s GeoCities Page! Welcome!',
    content: (
      <div style={{ fontFamily: 'Comic Sans MS, cursive', background: '#000080', color: '#00ff00', padding: '12px', minHeight: '400px' }}>
        <div style={{ textAlign: 'center', animation: 'none' }}>
          <div style={{ fontSize: '22px', color: '#ff0', fontWeight: 'bold' }}>
            ✨ WELCOME TO SATOSHI'S HOMEPAGE ✨
          </div>
          <div style={{ fontSize: '11px', color: '#ff8888', marginTop: '4px' }}>
            🔥 Best viewed in Internet Explorer 5.0 at 800x600 🔥
          </div>
          <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>
            Visitor #: <strong>000047</strong> [you are visitor 47! wow!]
          </div>
        </div>

        <hr style={{ borderColor: '#ff0', margin: '12px 0' }} />

        <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
          <p>Hi! My name is... <strong style={{ color: '#ff0' }}>S</strong>. Just S. That's enough.</p>
          <p>I am a <em>programmer</em> interested in <em>cryptography</em>, <em>economics</em>, 
          and <em>why banks charge $12 to move money</em>.</p>
          <p>I am working on a <strong>big project</strong>. Can't say more. 
          It involves math. Lots of math. You'd like it. Probably.</p>

          <div style={{ background: '#000040', padding: '8px', margin: '8px 0', border: '1px solid #ff0' }}>
            📧 <strong>Email me:</strong> anonymous@nowhere.net<br/>
            📡 <strong>IRC:</strong> #cypherpunks (I lurk mostly)<br/>
            🔐 <strong>PGP Key:</strong> Available on request. Obviously.
          </div>

          <p><strong style={{ color: '#ff8800' }}>Guestbook Messages:</strong></p>
          <div style={{ fontSize: '11px', background: '#000030', padding: '6px' }}>
            <div>🌟 <strong>Hal</strong>: Great page! Also, your email proposal is fascinating. Email me back.</div>
            <div>💬 <strong>mom</strong>: Is this you? Call me. Also eat something.</div>
            <div>❓ <strong>Anonymous</strong>: WHO ARE YOU???</div>
            <div>💬 <strong>Anonymous</strong>: WHO ARE YOU??????</div>
            <div>💬 <strong>Anonymous</strong>: WE KNOW IT'S YOU</div>
            <div style={{ color: '#ff8888' }}>💬 <strong>Satoshi</strong>: It's not me. — S</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '10px', color: '#666' }}>
          🚧 Under Construction 🚧 | Last updated: December 31, 1999 11:59:58 PM
        </div>
      </div>
    ),
  },
};

const HISTORY_ITEMS = [
  'www.google.com',
  'www.altavista.com',
  'www.bitcoin.org',
  'www.geocities.com/satoshi_home',
  'how to download more RAM - AltaVista results',
  'is math legal - AltaVista results',
  'www.yahoo.com',
  'byzantine generals problem - AltaVista',
  'www.altavista.com - how to be anonymous online',
  'hotmail.com - inbox',
  'cypherpunks mailing list archive',
];

export function IExplorer() {
  const [url, setUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [page, setPage] = useState<{ title: string; content: React.ReactNode } | null>(null);

  const navigate = (dest: string) => {
    const normalized = dest.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '').trim();
    setUrl(normalized);
    setInputUrl(normalized);
    setLoading(true);
    setShowHistory(false);

    setTimeout(() => {
      setLoading(false);
      const site = Object.keys(FAKE_SITES).find(k => normalized.includes(k) || k.includes(normalized));
      if (site) {
        setPage(FAKE_SITES[site]);
      } else {
        setPage({
          title: `Cannot find server: ${normalized}`,
          content: (
            <div style={{ fontFamily: 'Arial', padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', color: '#800', marginBottom: '12px' }}>
                The page cannot be displayed
              </div>
              <div style={{ fontSize: '13px', color: '#444', maxWidth: '500px', margin: '0 auto' }}>
                The Internet Explorer cannot display the webpage.<br/><br/>
                <strong>Address:</strong> {normalized}<br/><br/>
                Most likely causes:<br/>
                • The website does not exist yet<br/>
                • You are on dial-up and the modem timed out<br/>
                • The server is using Windows 98 and also crashed<br/>
                • The URL contains "bitcoin" (not invented yet)<br/><br/>
                <em style={{ color: '#666' }}>Try: <span style={{ color: '#00c', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('www.altavista.com')}>www.altavista.com</span></em>
              </div>
            </div>
          ),
        });
      }
    }, 800 + Math.random() * 600); // Fake dial-up delay
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'Arial', fontSize: '12px' }}>
      {/* Menu */}
      <div style={{ borderBottom: '1px solid #808080', padding: '2px 4px', display: 'flex', gap: '12px', background: '#c0c0c0' }}>
        {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map(m => (
          <span key={m} style={{ cursor: 'default', padding: '1px 4px' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#000080', e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.background = '', e.currentTarget.style.color = '')}>
            {m}
          </span>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ borderBottom: '1px solid #808080', padding: '4px', display: 'flex', gap: '4px', alignItems: 'center', background: '#c0c0c0' }}>
        <button style={{ padding: '2px 8px', cursor: 'pointer', fontSize: '11px' }}>⬅ Back</button>
        <button style={{ padding: '2px 8px', cursor: 'pointer', fontSize: '11px' }}>➡ Fwd</button>
        <button style={{ padding: '2px 8px', cursor: 'pointer', fontSize: '11px' }} onClick={() => navigate('www.google.com')}>🏠</button>
        <button style={{ padding: '2px 8px', cursor: 'pointer', fontSize: '11px' }} onClick={() => setShowHistory(h => !h)}>📜 History</button>
        <div style={{ flex: 1, display: 'flex', gap: '4px', alignItems: 'center' }}>
          <span>Address:</span>
          <input
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && navigate(inputUrl)}
            style={{
              flex: 1, padding: '2px 6px', fontSize: '12px',
              border: '2px inset #808080', fontFamily: 'Arial',
            }}
            placeholder="Type a web address..."
          />
          <button onClick={() => navigate(inputUrl)} style={{ padding: '2px 10px', cursor: 'pointer', fontSize: '12px' }}>Go</button>
        </div>
        <span style={{ fontSize: '22px' }}>🌐</span>
      </div>

      {/* History panel */}
      {showHistory && (
        <div style={{ position: 'absolute', right: 0, top: 60, width: 220, background: '#fff', border: '1px solid #808080', zIndex: 100, boxShadow: '2px 2px 6px rgba(0,0,0,0.3)' }}>
          <div style={{ background: '#c0c0c0', padding: '4px 8px', fontWeight: 'bold', fontSize: '11px' }}>📜 History</div>
          {HISTORY_ITEMS.map((h, i) => (
            <div key={i} onClick={() => navigate(h)} style={{ padding: '3px 8px', cursor: 'pointer', fontSize: '11px', borderBottom: '1px solid #eee', color: '#0000cc', textDecoration: 'underline' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e8e8ff')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}>
              {h}
            </div>
          ))}
        </div>
      )}

      {/* Page content */}
      <div style={{ flex: 1, overflow: 'auto', background: '#fff' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: '#444' }}>
            <div style={{ fontSize: '16px' }}>🌐 Connecting via dial-up...</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              ☎ Dialing 1-800-INTERNET...<br/>
              📡 Waiting for handshake...<br/>
              🐌 Negotiating 56k connection...
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#888' }}>
              khhhhhhhhhhhhhhhhh bong bong bong SSSSSSSSS...
            </div>
          </div>
        ) : !page ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '8px', color: '#444', fontFamily: 'Arial' }}>
            <div style={{ fontSize: '24px' }}>🌐</div>
            <div style={{ fontWeight: 'bold' }}>Internet Explorer 5.0</div>
            <div style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
              Type a web address to browse the internet.<br/>
              <br/>
              Suggestions:<br/>
              <span style={{ color: '#00c', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('www.google.com')}>www.google.com</span><br/>
              <span style={{ color: '#00c', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('www.altavista.com')}>www.altavista.com</span><br/>
              <span style={{ color: '#00c', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('www.geocities.com/satoshi_home')}>www.geocities.com/satoshi_home</span><br/>
              <span style={{ color: '#00c', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('www.bitcoin.org')}>www.bitcoin.org</span>
            </div>
          </div>
        ) : (
          <div style={{ padding: '8px' }}>
            {page.content}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div style={{ borderTop: '2px inset #808080', padding: '2px 8px', fontSize: '11px', color: '#444', display: 'flex', gap: '16px' }}>
        <span>{loading ? '🔄 Connecting...' : page ? '✅ Done' : '🌐 Ready'}</span>
        {url && <span>URL: {url}</span>}
        <span style={{ marginLeft: 'auto', color: '#666' }}>Internet zone | 🔒 Not secure (it's 1998)</span>
      </div>
    </div>
  );
}
