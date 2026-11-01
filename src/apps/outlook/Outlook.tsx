import React, { useState } from 'react';

const EMAILS = [
  {
    id: 'hal1',
    from: 'Hal <hal@finney.org>',
    subject: 'Re: Your anonymous proposal',
    date: 'Mon, 15 Mar 1998 14:23:11 -0800',
    body: `Hi,

I've read your proposal three times. Then a fourth time.

This is either the most brilliant thing I've ever seen,
or I need to go outside more. Possibly both.

The proof-of-work chained block idea is genuinely novel.
How are you solving the Byzantine generals problem exactly?
I see you've referenced it but the solution isn't clear.

Also: who ARE you? I'm not asking for personal reasons.
I'm asking because if you're real, I'd like to buy you 
a coffee. And if you're not real, I'd like to know that too.

No pressure either way.

Best,
Hal

P.S. Your email address is very anonymous. 
That's either professional or suspicious.
Congratulations on both.`,
    read: false,
  },
  {
    id: 'adam1',
    from: 'Adam <adam@hashcash.org>',
    subject: 'Re: Hashcash application',
    date: 'Tue, 8 Jun 1999 09:17:44 +0000',
    body: `Hi,

Interesting use of hashcash as a blockchain anchor.

I built hashcash for spam prevention. You're using it
to anchor a distributed ledger. That's either elegant
or overcomplicated. Honestly might be both.

The mining incentive mechanism is clever.
The 21 million cap is... interesting. Why 21 million?

Don't say "it felt right."

Did you say "it felt right"?

Anyway. Keep going. This has potential.
Also: have you slept recently? Your emails arrive at 3am.

— Adam`,
    read: true,
  },
  {
    id: 'wei1',
    from: 'Wei <weidai@eskimo.com>',
    subject: 'Your notes on b-money',
    date: 'Fri, 5 Nov 1999 22:04:28 -0700',
    body: `Hello,

I received your very diplomatic email about b-money.

"I've been building on some of your foundational ideas"
— I see what you did there. Very tactful.
Very NOT "I fixed your invention."

I appreciated that.

Your extension of the bootstrapping problem is interesting.
A genesis transaction to start the chain — elegant.

One concern: the energy consumption of proof-of-work 
at scale could be... significant.

I'm sure that won't be a problem.
(I'm actually not sure. I'm worried.)
(Please use renewable energy if this ever works.)

Best,
Wei`,
    read: false,
  },
  {
    id: 'mom1',
    from: 'Mom <mom@hotmail.com>',
    subject: 'Have you eaten?',
    date: 'Thu, 3 Dec 1998 12:01:33 +0530',
    body: `Sweetheart,

Have you eaten today?

I called three times. Your line was busy.
Are you on the internet again?

Please eat something that is not crackers.
I'm sending a care package. It will arrive in 2-3 weeks.
Please be alive when it gets there.

Also: your father wants to know how the "computer job" is going.
I told him very well. Is that right? 
You don't tell us much.

Whatever you're working on, I hope it makes you happy.
Not rich. Happy. Money isn't everything, you know.

(Although if it ALSO makes you rich, that would be okay.)

Love,
Mom

P.S. Call me. I bought a calling card.`,
    read: true,
  },
  {
    id: 'spam1',
    from: 'Nigerian Prince <prince@nwcbank.ng>',
    subject: '🎉 YOU ARE THE 1,000,000TH VISITOR! CLAIM YOUR PRIZE',
    date: 'Sat, 17 Jul 1999 03:44:22 +0000',
    body: `CONGRATULATIONS!!!

You have been selected as our ONE MILLIONTH VISITOR!

Your prize: 50 BTC!!!
(Note: Bitcoin does not exist yet. 
 We are confident it will exist soon.
 We are ahead of our time.)

To claim your prize, please send us:
- Your full name
- Your address  
- Your banking details
- Your soul (optional but preferred)

This offer expires in 24 hours.
Actually it expires never. We'll keep emailing.

Warm regards,
Prince Mutumbo Nakashima III
Director, First National Crypto Bank of Internet

[SATOSHI'S NOTE IN MARGINS: "The irony of getting a fake crypto 
email while inventing real crypto is not lost on me."]`,
    read: false,
  },
  {
    id: 'spam2',
    from: 'MoneyFast <profits@richquick.biz>',
    subject: 'How to download MORE RAM - LEGALLY',
    date: 'Sun, 4 Apr 1999 15:22:17 +0000',
    body: `Dear Computer User,

Running out of RAM? 
DON'T BUY MORE. DOWNLOAD MORE.

Our patented RamBooster™ technology lets you
download up to 512MB of RAM directly from the internet!

Requirements:
- Windows 95, 98, or ME (NT not supported)
- A modem (56k recommended)
- Willingness to believe this works

Price: FREE (then $49.99/month)

Download now: www.downloadmoreram.com

WARNING: May not actually download RAM.
Side effects include: false hope, slow computer,
and a $49.99 charge to your credit card.

[SATOSHI'S NOTE: "How are these people not in jail"
                  "Asking for a friend"
                  "The friend is me"
                  "I am in a glass house re: inventing imaginary money"]`,
    read: true,
  },
];

export function Outlook() {
  const [selectedEmail, setSelectedEmail] = useState<typeof EMAILS[0] | null>(null);
  const [emails, setEmails] = useState(EMAILS);
  const [folder, setFolder] = useState<'inbox' | 'sent' | 'drafts' | 'trash'>('inbox');

  const markRead = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, read: true } : e));
  };

  const unreadCount = emails.filter(e => !e.read).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
      {/* Menu bar */}
      <div style={{ borderBottom: '1px solid #808080', padding: '2px 4px', display: 'flex', gap: '12px', background: '#c0c0c0' }}>
        {['File', 'Edit', 'View', 'Tools', 'Message', 'Help'].map(m => (
          <span key={m} style={{ cursor: 'default', padding: '1px 4px' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#000080', e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.background = '', e.currentTarget.style.color = '')}>
            {m}
          </span>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ borderBottom: '1px solid #808080', padding: '4px', display: 'flex', gap: '8px', background: '#c0c0c0' }}>
        <button style={{ padding: '2px 10px', fontSize: '12px', cursor: 'pointer' }}>📩 New Mail</button>
        <button style={{ padding: '2px 10px', fontSize: '12px', cursor: 'pointer' }}>↩ Reply</button>
        <button style={{ padding: '2px 10px', fontSize: '12px', cursor: 'pointer' }}>📤 Forward</button>
        <button style={{ padding: '2px 10px', fontSize: '12px', cursor: 'pointer' }}>🗑️ Delete</button>
        <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#666', alignSelf: 'center' }}>
          📡 Connected via: Dial-up (56k) | Status: Nominal (barely)
        </div>
      </div>

      {/* Main area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Folder tree */}
        <div style={{ width: '140px', borderRight: '1px solid #808080', padding: '4px', fontSize: '11px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>Outlook Express</div>
          {[
            { key: 'inbox', label: `Inbox (${unreadCount})`, icon: '📥' },
            { key: 'sent', label: 'Sent Items', icon: '📤' },
            { key: 'drafts', label: 'Drafts (47)', icon: '📝' },
            { key: 'trash', label: 'Deleted Items', icon: '🗑️' },
          ].map(f => (
            <div key={f.key}
              onClick={() => setFolder(f.key as any)}
              style={{
                padding: '3px 4px',
                cursor: 'default',
                background: folder === f.key ? '#000080' : 'transparent',
                color: folder === f.key ? '#fff' : '#000',
                display: 'flex', gap: '4px', alignItems: 'center',
              }}>
              {f.icon} {f.label}
            </div>
          ))}
          <div style={{ marginTop: '12px', fontSize: '10px', color: '#888' }}>
            47 drafts of the Bitcoin whitepaper. 46 deleted.
          </div>
        </div>

        {/* Email list */}
        <div style={{ width: '260px', borderRight: '1px solid #808080', overflow: 'auto' }}>
          <div style={{ background: '#d4d0c8', padding: '2px 8px', borderBottom: '1px solid #808080', display: 'flex', gap: '8px', fontSize: '11px' }}>
            <span style={{ flex: 1 }}>From</span>
            <span>Date</span>
          </div>
          {folder === 'inbox' ? emails.map(email => (
            <div
              key={email.id}
              onClick={() => { setSelectedEmail(email); markRead(email.id); }}
              style={{
                padding: '4px 8px',
                cursor: 'default',
                background: selectedEmail?.id === email.id ? '#000080' : 'transparent',
                color: selectedEmail?.id === email.id ? '#fff' : '#000',
                borderBottom: '1px solid #e0e0e0',
                fontWeight: email.read ? 'normal' : 'bold',
              }}
            >
              <div style={{ fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {!email.read && <span>🔵 </span>}
                {email.from.split('<')[0].trim()}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 'normal', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: selectedEmail?.id === email.id ? '#ccc' : '#666' }}>
                {email.subject}
              </div>
            </div>
          )) : (
            <div style={{ padding: '12px', color: '#666', fontSize: '11px', fontStyle: 'italic' }}>
              {folder === 'drafts' ? '47 drafts of a Bitcoin whitepaper.\nTitle evolution:\n"DigiCoin"\n"CryptoCash"\n"P2P Money Thing"\n"Peer-to-Peer Electronic Cash"\n(final answer)' : 'No messages here.'}
            </div>
          )}
        </div>

        {/* Email body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '8px', background: '#fff' }}>
          {selectedEmail ? (
            <>
              <div style={{ borderBottom: '1px solid #c0c0c0', paddingBottom: '8px', marginBottom: '8px' }}>
                <div><strong>From:</strong> {selectedEmail.from}</div>
                <div><strong>Subject:</strong> {selectedEmail.subject}</div>
                <div><strong>Date:</strong> {selectedEmail.date}</div>
                <div><strong>To:</strong> anonymous@nowhere.net</div>
              </div>
              <pre style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', whiteSpace: 'pre-wrap', lineHeight: '1.5', margin: 0 }}>
                {selectedEmail.body}
              </pre>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888', fontStyle: 'italic' }}>
              Select a message to read it.<br />
              <span style={{ fontSize: '11px' }}>(The mom email is in there. Go read it.)</span>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div style={{ borderTop: '2px inset #808080', padding: '2px 8px', fontSize: '11px', color: '#444' }}>
        {emails.length} messages, {unreadCount} unread | 
        <span style={{ color: '#666' }}> Last sync: 1999-01-03 18:15:05 UTC</span>
      </div>
    </div>
  );
}
