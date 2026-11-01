// Virtual File System - persisted in localStorage
export interface FSItem {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: Record<string, FSItem>;
  size?: number;
  created?: string;
  modified?: string;
  icon?: string;
  protected?: boolean;
  passwordHint?: string;
}

export const SATOSHI_FILES: Record<string, FSItem> = {
  'My Documents': {
    name: 'My Documents',
    type: 'folder',
    icon: 'folder',
    children: {
      'ecash_ideas.txt': {
        name: 'ecash_ideas.txt',
        type: 'file',
        created: '1997-03-14',
        modified: '1997-04-01',
        content: `ECash Ideas - Brainstorm Session
===================================
Date: March 1997

What if money... but anonymous?

- Problem: Banks know everything. EVERYTHING. 
  They know I bought 47 bags of Cheetos last month.
  That is NOT their business.
  
- Problem 2: Governments can inflate money whenever
  they want. Just print more! Wild.
  
- Solution(?): Cryptographic digital money
  - Nobody controls it
  - Nobody knows who owns what
  - Supply is fixed (unlike my cousin Priya who 
    never has a fixed schedule)
  
- Key question: How do you prevent double-spending 
  without a central authority?
  
Thought: What if every transaction was public BUT
anonymous? Like... everyone can see the math
but nobody knows the person.

This is either genius or deeply illegal.
Possibly both.

Must research more. Also must eat something.
Todo: Buy food. Think more. Sleep (optional).

- S`
      },
      'hashcash_notes.doc': {
        name: 'hashcash_notes.doc',
        type: 'file',
        created: '1998-01-22',
        modified: '1998-06-15',
        content: `HASHCASH NOTES - ref: Adam Back's paper
=========================================

Adam Back is onto something. 
Proof-of-work for email spam! Brilliant.
(Adam if you're reading this: you're brilliant. 
Please don't ever change. Also answer my emails.)

Core concept: Make sending email COST something
in computation. Spammers can't afford it.

MY TWIST: What if this proof-of-work wasn't just
for email? What if it secured an entire ledger?

Let's say you want to add a transaction to a 
shared record. You have to do some math first.
Hard math. Not like "find X" math. Like
"find X where the hash of this block starts with
17 zeroes" math.

Why does this matter?
- You can't fake it (math doesn't lie)
- You can verify instantly (hashes are fast to check)
- Whoever does the most work controls the record

The person with the most computational power
wins. Democratically! (Sort of. Not really.)

WARNING TO SELF: This could use a LOT of electricity.
I hope nobody builds this on a large scale.
That would be irresponsible.

Also: Need to write to Adam about this. His paper
inspired me. He's going to be credited in
whatever I eventually publish. Probably.
I'll figure out authorship later.`
      },
      'b-money_critique.txt': {
        name: 'b-money_critique.txt',
        type: 'file',
        created: '1998-11-27',
        modified: '1999-02-01',
        content: `CRITIQUE OF WEI DAI'S B-MONEY PROPOSAL
=========================================
(This is a private document. If Wei is reading
this somehow: I mean this with deep respect.)

Wei's idea (b-money, 1998) is incredible.
Like, genuinely incredible. I've read it 12 times.
Each time I get more excited and then more annoyed.

WHAT'S GREAT:
- Decentralized currency system
- Anonymous digital cash
- Cryptographic enforcement
- Wei clearly didn't sleep for weeks writing this

WHAT'S MISSING:
- How do you actually LAUNCH it?
- Who maintains the first database?
- Bootstrapping problem: who goes first?
- Doesn't solve the Byzantine generals problem
  (yes I know what that is, I'm not just saying it
   to sound smart... okay partly to sound smart)

My proposed solution: 
Start with a single "genesis" block.
A moment in time when everything begins.
Encode a newspaper headline in it.
Timestamp. Immutable. Like... the big bang,
but for money.

This is definitely not overambitious.

I should email Wei about this.
Subject line idea: "Hi, I fixed your invention"
(Do NOT send that. Write a nicer version.)

Draft v1: "Hi Wei, your b-money paper is brilliant.
I've been thinking about it..."

Yes. That's better.

I am going to figure this out.`
      },
      'bitcoin_v0.0.1_DRAFT.doc': {
        name: 'bitcoin_v0.0.1_DRAFT.doc',
        type: 'file',
        created: '2000-08-18',
        modified: '2001-09-03',
        content: `BITCOIN: A PEER-TO-PEER ELECTRONIC CASH SYSTEM
(Working Title. Other options: "DigiCoin", "CryptoCash",
"MoneyBucks", "HashDollars" — will decide later)
================================================

ABSTRACT:

A purely peer-to-peer version of electronic cash 
would allow online payments to be sent directly 
from one party to another without going through a 
financial institution. 

[NOTE TO SELF: This sounds too fancy. Normal people 
need to understand this. Rewrite more casual?

Actually no. Keep it fancy. Nobody trusts casual math.]

INTRODUCTION:

Commerce on the Internet has come to rely almost 
exclusively on financial institutions serving as 
trusted third parties to process electronic payments.

[FOOTNOTE IDEA: Banks, essentially. I'm talking about 
banks. You know. Those places that are also definitely
keeping records of your Cheetos purchases.]

We propose a solution to the double-spending problem 
using a peer-to-peer distributed timestamp server to 
generate computational proof of the chronological 
order of transactions.

The system is secure as long as honest nodes 
collectively control more CPU power than any 
cooperating group of attacker nodes.

SUPPLY:
Maximum: 21,000,000 units
(I chose 21 million because it felt right.
Don't overthink it. I didn't.
...I overthought it for 3 weeks actually.)

NAME: I'm calling the unit "bitcoin"
Small case. Lowercase. Like the internet was lowercase.
(Satoshi, you're overthinking the capitalization.
Just pick one. JUST PICK ONE.)

STATUS: DRAFT DRAFT DRAFT
Do not publish yet.
Not ready.
Almost ready.
Getting there.
Maybe ready in 2008?
[note: actual publication target - "when I figure out 
the last 3% of the technical details"]

-- S.N.`
      },
      'TODO.txt': {
        name: 'TODO.txt',
        type: 'file',
        created: '1999-01-01',
        modified: '2001-12-31',
        content: `TODO LIST
=========

[x] Learn cryptography
[x] Read every cypherpunk mailing list post ever
[x] Email Wei Dai (send friendly version)
[x] Email Adam Back (also friendly version)
[x] Solve Byzantine Generals Problem
[x] Invent proof-of-work based blockchain
[ ] Tell anyone about it
[ ] Figure out what to do with 21M coins
[ ] Reply to mom's emails
[ ] Do laundry
[ ] Eat a vegetable
[ ] Go outside (weather permitting, or just generally)
[ ] Figure out real name situation
[ ] sleep (postponed)`
      },
      'diary.txt': {
        name: 'diary.txt',
        type: 'file',
        created: '1997-01-01',
        modified: '2001-10-31',
        content: `PERSONAL DIARY — PRIVATE
(if you found this, please close it)
(seriously)
(okay fine, read it, I can't stop you)
=====================================

Jan 3, 1997
------------
Started thinking about digital money again today.
The banks charge me $12 to move my own money.
TWELVE DOLLARS. I could buy 3 Taco Bells.
This cannot stand.

March 15, 1998
--------------
Sent an email to the cypherpunks list. 
23 people replied. 19 were arguing.
3 were spam.
1 was Hal, who actually understood what I said.
Hal is the only person who understands me.
I might be in love with cryptography.

August 7, 1999
--------------
Had a dream where I invented anonymous digital money
and then couldn't buy pizza because the pizza place
didn't accept it. Classic.

Woke up. Wrote 40 pages of notes.
Didn't eat. Definitely should have eaten.

February 28, 2000
-----------------
Progress report (to myself, because who else would care):
- Blockchain concept: SOLVED
- Double-spend problem: SOLVED (I think)
- Mining mechanism: SOLVED
- Wallet system: SOLVED
- What I do with 21 million imaginary coins: NOT SOLVED
- My social life: also NOT SOLVED (related?)

The password to the Private folder is: genesis
(I'm hiding this in plain sight because I'm paranoid
AND forgetful. It works out.)

July 4, 2001
------------
Independence Day. How fitting.
Today I wrote what might be the final draft.
A peer-to-peer electronic cash system.

I've been awake for 31 hours.
I ate a cracker earlier. 
It was sustaining.

If this ever works, historians will wonder
who I am. Let them wonder.
That's kind of the whole point.

Goodnight, future world.
Goodnight, blockchain.
Goodnight, 21 million coins nobody believes in yet.

-- S`
      },
      'cypherpunks_list_archive.txt': {
        name: 'cypherpunks_list_archive.txt',
        type: 'file',
        created: '1997-06-01',
        modified: '2000-12-31',
        content: `CYPHERPUNKS MAILING LIST - PERSONAL ARCHIVE
Selected excerpts, saved by me for... reasons.
=============================================

FROM: Hal <hal@finney.org>
TO: cypherpunks@toad.com
DATE: April 12, 1998
SUBJECT: Re: Digital Cash Proposal

> This is a fascinating approach to the problem.
> If the math holds up (and it looks like it might),
> this could actually work. Who is this person?

[MY COMMENT: Hal gets it. Hal always gets it.
Send Hal a thank you note. Don't sign it.]

---

FROM: Timothy <tcmay@got.net>
TO: cypherpunks@toad.com  
DATE: April 13, 1998
SUBJECT: Re: Digital Cash Proposal

> Another digital currency scheme. Wake me up when
> someone actually ships something.

[MY COMMENT: Fair. I respect the skepticism.
Watch me, Timothy. WATCH ME.]

---

FROM: unknown@anonymous.penet.fi
TO: cypherpunks@toad.com
DATE: June 6, 1999
SUBJECT: Anonymous Communication

> Privacy is not secrecy. A private matter is
> something one doesn't want the whole world to know,
> but a secret matter is something one doesn't want
> anybody to know. Privacy is the power to selectively 
> reveal oneself to the world.
>
> Eric Hughes, A Cypherpunk's Manifesto, 1993

[MY COMMENT: This is why I'm doing this.
This. Exactly this.
Okay, I need to take a walk. Brb.]

---

FROM: Wei <weidai@eskimo.com>
TO: cypherpunks@toad.com
DATE: November 27, 1998
SUBJECT: b-money

> I am fascinated with Tim May's crypto-anarchy.
> Unlike the communities usually associated with the
> word "anarchy", in a crypto-anarchy the government
> is not temporarily destroyed but permanently
> forbidden and permanently unnecessary.

[MY COMMENT: WEI. YES. This is it.
I've been building on his b-money ideas.
Should I tell him?
I should tell him.
I'll tell him anonymously.
Very on-brand.]`
      },
      'Private': {
        name: 'Private',
        type: 'folder',
        protected: true,
        passwordHint: 'Check the diary. You know, the personal one.',
        children: {
          'wallet.dat': {
            name: 'wallet.dat',
            type: 'file',
            content: `WALLET DATA FILE — BINARY ENCODED
==================================
[Corruption detected in display. Raw data follows:]

4269 7463 6f69 6e20 5761 6c6c 6574 0a
ADDR: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
BALANCE: 50.00000000 BTC

Genesis Block Reward
Block: #0
Timestamp: 2009-01-03 18:15:05 UTC
Message: "The Times 03/Jan/2009 Chancellor on 
          brink of second bailout for banks"

[Additional addresses: ~1,000,000 BTC]

Current value: approximately $0.00
Estimated future value: unknown
(probably nothing lol)

DO NOT LOSE THIS FILE.
I mean it.
SERIOUSLY.
You have no idea.`
          }
        }
      }
    }
  },
  'My Pictures': {
    name: 'My Pictures',
    type: 'folder',
    icon: 'folder',
    children: {
      'titanic_1997.jpg': {
        name: 'titanic_1997.jpg',
        type: 'file',
        content: 'IMAGE_FILE',
        icon: 'image'
      },
      'world_cup_1998.jpg': {
        name: 'world_cup_1998.jpg',
        type: 'file',
        content: 'IMAGE_FILE',
        icon: 'image'
      },
      'Y2K_countdown.jpg': {
        name: 'Y2K_countdown.jpg',
        type: 'file',
        content: 'IMAGE_FILE',
        icon: 'image'
      },
      'tamagotchi_rip.jpg': {
        name: 'tamagotchi_rip.jpg',
        type: 'file',
        content: 'IMAGE_FILE',
        icon: 'image'
      },
      'NOT_me.jpg': {
        name: 'NOT_me.jpg',
        type: 'file',
        content: 'IMAGE_FILE',
        icon: 'image'
      }
    }
  },
  'My Music': {
    name: 'My Music',
    type: 'folder',
    children: {
      'Backstreet_Boys_I_Want_It_That_Way.mp3': { name: 'Backstreet_Boys_I_Want_It_That_Way.mp3', type: 'file', content: 'AUDIO_FILE' },
      'Mambo_No_5.mp3': { name: 'Mambo_No_5.mp3', type: 'file', content: 'AUDIO_FILE' },
      'blockchain_themed_playlist.m3u': {
        name: 'blockchain_themed_playlist.m3u',
        type: 'file',
        content: `#EXTM3U
#EXTINF:213,The Verve - Bittersweet Symphony
Bittersweet_Symphony.mp3
#EXTINF:285,Portishead - Mysterons  
mysterons.mp3
#EXTINF:194,Daft Punk - Da Funk
da_funk.mp3
#EXTINF:331,Radiohead - Karma Police
karma_police.mp3

[Note: These songs have nothing to do with 
blockchain. I just like them. 
- S]`
      }
    }
  },
  'Program Files': {
    name: 'Program Files',
    type: 'folder',
    children: {
      'Bitcoin_v0.0.1_alpha': {
        name: 'Bitcoin_v0.0.1_alpha',
        type: 'folder',
        children: {
          'bitcoin.exe': { name: 'bitcoin.exe', type: 'file', content: 'EXECUTABLE' },
          'readme.txt': {
            name: 'readme.txt',
            type: 'file',
            content: `Bitcoin v0.0.1 Alpha - DO NOT DISTRIBUTE
=========================================

Installation instructions:
1. Run bitcoin.exe
2. Wait for blockchain to download
   (estimated time: several decades at current adoption)
3. Start mining
4. ???
5. Financial revolution

Known bugs:
- Nobody else is running it yet
- Not sure what the coins are worth
- Possibly everything. Possibly nothing.

System requirements:
- Windows 98 SE
- 64MB RAM (128MB recommended for paranoia)
- Internet connection (dial-up acceptable)  
- Philosophical acceptance of decentralized currency

Support: Do not contact me. I will not respond.
That's the whole point.

Version history:
v0.0.1 - Initial alpha (you are here)
v0.1.0 - TBD
v1.0.0 - The dream

© 1998-2001 Anonymous. All rights reserved.
No rights reserved. 
It's open source.
Obviously.`
          }
        }
      }
    }
  },
  'Windows': {
    name: 'Windows',
    type: 'folder',
    children: {
      'System32': {
        name: 'System32',
        type: 'folder',
        children: {
          'blockchain.dll': { name: 'blockchain.dll', type: 'file', content: 'SYSTEM_FILE' },
          'anonymity.sys': { name: 'anonymity.sys', type: 'file', content: 'SYSTEM_FILE' },
          'satoshi.exe': { name: 'satoshi.exe', type: 'file', content: 'EXECUTABLE' }
        }
      }
    }
  }
};

const RECYCLE_BIN_FILES: Record<string, FSItem> = {
  'bitcoin_FINAL_v3_REAL.doc': {
    name: 'bitcoin_FINAL_v3_REAL.doc',
    type: 'file',
    content: `This is the real final version.
(Previous "FINAL" versions were not final.)
(This one also might not be final.)
(v4 exists. Don't ask.)

Core changes from v3:
- Removed the part where I explain my identity
- Added more math
- Removed the joke (too casual)
- Added the joke back (too serious without it)
- Changed font from Comic Sans to Times New Roman
  then back to Courier because I'm a programmer
  and Courier is the correct font for manifestos

Status: Deleted because v4 is better.
v4 location: I'll remember. I always remember.
[I have not remembered. It's been 3 months.]`
  },
  'lambo_fund.xls': {
    name: 'lambo_fund.xls',
    type: 'file',
    content: `LAMBORGHINI FUND SAVINGS TRACKER
==================================

Current balance: $0.00
Bitcoin held: ~1,000,000 BTC
Current BTC value: $0.00

Projected value if BTC = $1:    $1,000,000
Projected value if BTC = $100:  $100,000,000
Projected value if BTC = $10k:  $10,000,000,000

Note: I deleted this spreadsheet because 
it made me feel like an idiot for dreaming.
But what if.
WHAT IF.

[Restored from Recycle Bin 14 times]
[Deleted again. This is the last time.]
[It is not the last time.]`
  },
  'pizza_order.txt': {
    name: 'pizza_order.txt',
    type: 'file',
    content: `DRAFT EMAIL - NEVER SENT (THANK GOD)
=====================================
To: laszlo@pizza.com
Subject: Trade offer

Hi,

I would like to offer 10,000 bitcoins in exchange
for two large pizzas (pepperoni preferred).

Bitcoin is a new digital currency I invented.
It's worth... technically nothing right now.
But one day it might be worth something!

Estimated value of 10,000 BTC: $0.00
Estimated value of 2 pizzas: $25.00

So I would be... trading $0 for $25? 
Hmm. This seems bad for me.

Actually no wait. The pizza is real. Real food.
And the coins are imaginary. So maybe this is fine?

On reflection: too expensive. Will eat crackers.

[DELETED: May 22, 2000]
[This file is now in Recycle Bin]
[Historic note: Someone actually did this in 2010]
[10,000 BTC for 2 pizzas]  
[Current value: please don't calculate this]`
  },
  'me_before_the_internet.jpg': {
    name: 'me_before_the_internet.jpg',
    type: 'file',
    content: 'IMAGE_FILE',
    icon: 'image'
  },
  'social_life.exe': {
    name: 'social_life.exe',
    type: 'file',
    content: 'EXECUTABLE'
  }
};

const LS_KEY = 'win98_fs_v1';
const RECYCLE_KEY = 'win98_recycle_v1';

export function loadFS(): Record<string, FSItem> {
  try {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return SATOSHI_FILES;
}

export function saveFS(fs: Record<string, FSItem>) {
  localStorage.setItem(LS_KEY, JSON.stringify(fs));
}

export function loadRecycleBin(): Record<string, FSItem> {
  try {
    const stored = localStorage.getItem(RECYCLE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return RECYCLE_BIN_FILES;
}

export function saveRecycleBin(rb: Record<string, FSItem>) {
  localStorage.setItem(RECYCLE_KEY, JSON.stringify(rb));
}

export function resetFS() {
  localStorage.removeItem(LS_KEY);
  localStorage.removeItem(RECYCLE_KEY);
}

export function getItemAtPath(fs: Record<string, FSItem>, path: string[]): FSItem | null {
  let current: FSItem | Record<string, FSItem> = fs;
  for (const segment of path) {
    if ('children' in current && current.children) {
      current = current.children;
    }
    if (typeof current === 'object' && segment in current) {
      current = (current as Record<string, FSItem>)[segment];
    } else {
      return null;
    }
  }
  return current as FSItem;
}
