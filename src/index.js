// @ts-check
const { freeze, keys, values, entries, fromEntries } = Object;

function assert(cond) {
  if (!cond) throw new Error();
}

/**
 *
 * @param {Record<string, V>} obj
 * @param {(prop: string) => boolean} pred
 * @template V
 */
function filterKeys(obj, pred) {
  return fromEntries(entries(obj).filter(([prop, _]) => pred(prop)));
}

/**
 *
 * @param {Contents} initClear
 * @param {Contents=} locked
 */
function WalletImpl(initClear, locked = {}) {
  /** @type {Contents} */
  let clear = initClear;

  const self = freeze({
    /**
     * @param {Contents} byAddr
     */
    insert(byAddr) {
      keys(byAddr).forEach((addr) => {
        assert(!keys(clear).includes(addr));
        assert(!keys(locked).includes(addr));
      });
      const update = { ...clear, ...byAddr };
      assert(
        [...values(clear), ...values(locked)].filter(([k, _]) => k === 'owner')
          .length === 1,
      );
      clear = update;
    },
    getKeys() {
      return [...keys(locked), ...keys(clear)];
    },
    /**
     * @param {REVAddress} addr
     */
    getValue(addr) {
      return locked[addr] || clear[addr];
    },
    /**
     * @param {REVAddress[]} addrs
     */
    getValues(addrs) {
      return fromEntries(addrs.map((addr) => [addr, self.getValue(addr)]));
    },
    /**
     * @param {Contents} byAddr
     */
    update(byAddr) {
      entries(byAddr).forEach(([addr, val]) => {
        if (keys(clear).includes(addr)) {
          clear[addr] = val;
        } else if (keys(locked).includes(addr)) {
          locked[addr] = val;
        } else {
          // ISSUE: partial updates?
          throw new RangeError(addr);
        }
      });
    },
    /**
     * @param {REVAddress[]} addrs
     */
    delete(addrs) {
      addrs.forEach((addr) => {
        assert(addr in clear || addr in locked);
        delete clear[addr];
        delete locked[addr];
      });
    },
    /**
     * @param {REVAddress[]} addrs
     */
    lock(addrs) {
      const newLocked = filterKeys(clear, (addr) => addrs.includes(addr));
      const newClear = filterKeys(clear, (addr) => !addrs.includes(addr));
      return WalletImpl(newClear, newLocked);
    },
  });

  return self;
}

/**
 * Digital Accreditation wallet
 *
 * ISSUE: principal REVAddress is REVAddress of
 * deployerId public key.
 *
 * @param {REVAddress} owner
 * @param {Asset} idVerification
 *
 * ISSUE: Uint8array?
 * @typedef {string} REVAddress
 * @typedef {string} HumanFriendlyKey
 * @typedef {unknown} Asset
 * @typedef {Record<REVAddress, [HumanFriendlyKey, Asset]>} Contents
 *
 * @typedef {[REVAddress, REVAddress]} Link
 */
export function Wallet(owner, idVerification) {
  return WalletImpl({ [owner]: ['owner', idVerification] });
}

/**
 * @typedef {[Asset, Sig]} Attestation<Sig>
 * @template Sig
 *
 * ISSUE: Sig <: { verify(Asset): boolean }
 */
