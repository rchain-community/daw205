// @ts-check
import test from 'ava';

import { Wallet } from '../src';

const [acct1, acct2, acct3] = [
  {
    privateKey:
      '56c693042a32b751c283cdc34e6a6747679be7b6ff8f3a207f51089b871e2ca2',
    publicKey:
      '045faa353676faaa03dab328ff2759f36a2a2cfefef1a28a5d97eb7ef471016e22d5c136f4940ee23b0c4d5df2a6870f64b68e9b907c2c69813ab5537072668285',
    ETH: '19da96487e59a3dc4b37daebfc71362e310376bf',
    REV: '11112FQqtitKJkBrTDpGo91UBTDbj82TX5iigCc3igLXfL6xtCaEX8',
  },
  {
    privateKey:
      '395acd788d7ef850fea031b5771b34751ed92d3b834510995a7ee3b795bfd732',
    publicKey:
      '04d680ca96181469a3eaa28279b8b5d63e07e1fba300cea892e1b9c947d32610db4d41a68d9692f38e712ade3a4e48c49019cfa32cdcb8a639686359d618c3221b',
    ETH: 'a8363d52ce7081656ef6a2b74822ff1947dc473e',
    REV: '11112QH1ajKZdmnyoEVKk96QsDLzCFLFnjgzfkGkiuS5Xxp97TrihD',
  },
  {
    privateKey:
      '47613c96c378516ffcaf9e6c73ad9beb5f418d4b53e7f6177f53bc5446c1be41',
    publicKey:
      '04e0f14097480af98dd1e61325bbeb63416955fc6a94653a6b2c5c58692673919fba5127a73ac81567c77939a78aa97a7f438d101936b62a9627dc976c1b252c73',
    ETH: 'fa1fce009484d7d46ed9527b02b21efb6b3b7c5f',
    REV: '1111vELcrk9ynorqjskdvkXBMHo3yWakztAo5MTGXvBHugBzqtFN8',
  },
];

test('hello', (t) => {
  const w1 = Wallet(acct1.REV, 'idcard1');
  t.is(w1, w1);
  w1.insert({ 111234: ['height', '6\'1"'], 111231: ['weight', '200lb'] });
  const lw1 = w1.lock([acct1.REV]);
  lw1.update({ [acct1.REV]: ['owner', 'idcard2'] });

  t.deepEqual(w1.getValue(acct1.REV), ['owner', 'idcard1']);
  t.deepEqual(lw1.getValue(acct1.REV), ['owner', 'idcard2']);

  t.deepEqual(lw1.getKeys(), [
    '11112FQqtitKJkBrTDpGo91UBTDbj82TX5iigCc3igLXfL6xtCaEX8',
    '111231',
    '111234',
  ]);

  t.deepEqual(
    lw1.getValues([
      '11112FQqtitKJkBrTDpGo91UBTDbj82TX5iigCc3igLXfL6xtCaEX8',
      '111231',
      '111234',
    ]),
    {
      '11112FQqtitKJkBrTDpGo91UBTDbj82TX5iigCc3igLXfL6xtCaEX8': [
        'owner',
        'idcard2',
      ],
      111231: ['weight', '200lb'],
      111234: ['height', '6\'1"'],
    },
  );
});

test('ownership', (t) => {
  const link1 = [acct1.REV, acct2.REV];
  const sig = sign(acct3.privateKey, JSON.stringify(link1));
});

// LGM gave another user story...
// alice is vaccinated
// alice, NHS sign vaccination record
// alice can decrypt record

// social key recovery (stretch goal)
// store a list of friends
// if Boris steals a key... er... can't he
// assert all the same things that Alice can?
// I guess he can't assert things that Alice's
// friends can assert.
