// @ts-check
import test from 'ava';

import { Wallet } from '../src';

test('hello', (t) => {
  const acct1 = {
    privateKey:
      '56c693042a32b751c283cdc34e6a6747679be7b6ff8f3a207f51089b871e2ca2',
    publicKey:
      '045faa353676faaa03dab328ff2759f36a2a2cfefef1a28a5d97eb7ef471016e22d5c136f4940ee23b0c4d5df2a6870f64b68e9b907c2c69813ab5537072668285',
    ETH: '19da96487e59a3dc4b37daebfc71362e310376bf',
    REV: '11112FQqtitKJkBrTDpGo91UBTDbj82TX5iigCc3igLXfL6xtCaEX8',
  };

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
