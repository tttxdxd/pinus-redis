import "mocha";
import * as should from 'should';

import Helper from "./helper";

describe('#Redis bitmap 位图', function () {
  let proxy = Helper.Proxy.Bitmap;

  let testKey = 'test:key';
  let testKey2 = 'test:key2';
  let testValue = 'testValue';
  let testValue2 = 'testValue2';

  afterEach(async function () {
    await proxy.del(testKey, testKey2);
  });

  it('setbit', async function () {
    should.strictEqual(await proxy.setbit(testKey, 0, 1), 0);
    should.strictEqual(await proxy.setbit(testKey, 2, 1), 0);
    should.strictEqual(await proxy.setbit(testKey, 4, 1), 0);
    should.strictEqual(await proxy.setbit(testKey, 4, 1), 1);
  });

  it('getbit', async function () {
    should.strictEqual(await proxy.getbit(testKey, 0), 0);
    should.strictEqual(await proxy.setbit(testKey, 2, 1), 0);
    should.strictEqual(await proxy.getbit(testKey, 2), 1);
  });

  it('bitcount', async function () {
    should.strictEqual(await proxy.setbit(testKey, 0, 1), 0);
    should.strictEqual(await proxy.setbit(testKey, 2, 1), 0);
    should.strictEqual(await proxy.bitcount(testKey), 2);

    should.strictEqual(await proxy.setbit(testKey, 3, 1), 0);
    should.strictEqual(await proxy.bitcount(testKey), 3);
  });

  it('bitpos', async function () {
    should.strictEqual(await proxy.setbit(testKey, 0, 1), 0);
    should.strictEqual(await proxy.setbit(testKey, 2, 1), 0);

    should.strictEqual(await proxy.bitpos(testKey, 1), 0);
    should.strictEqual(await proxy.bitpos(testKey, 0), 1);
  });

  it('bitop', async function () {
    should.strictEqual(await proxy.setbit(testKey, 0, 1), 0);

    should.strictEqual(await proxy.bitop('AND', testKey2, testKey), 1);
    should.strictEqual(await proxy.setbit(testKey, 8, 1), 0);

    should.strictEqual(await proxy.bitop('AND', testKey2, testKey), 2);
  });

  it('bitfield get set', async function () {
    // | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 |
    should.deepEqual(await proxy.bitfield(testKey, 'SET', 'i8', 0, 4, 'SET', 'i8', 8, 1, 'SET', 'i8', 9, 1), [0, 0, 2]);
    // | 0 0 0 0 0 1 0 0 | 0 0 0 0 0 0 0 1 |

    should.deepEqual(await proxy.bitfield(testKey, 'GET', 'i8', 0), [4]);
    should.deepEqual(await proxy.bitfield(testKey, 'GET', 'i8', 2), [16]);

    should.deepEqual(await proxy.bitfield(testKey, ...proxy.cmdGet('i8', 0)), [4]);
  });

  it('bitfield incrby', async function () {
    // | 0 0 0 0 0 0 0 0 |
    should.deepEqual(await proxy.bitfield(testKey, 'INCRBY', 'i8', '#0', 2, 'INCRBY', 'i8', '#0', 2), [2, 4]);
    // | 0 0 0 0 0 0 0 1 |

    should.deepEqual(await proxy.bitfield(testKey, ...proxy.cmdGet('i8', '#0'), ...proxy.cmdGet('i8', '#0')), [4, 4]);
  });

  it('bitfield overflow', async function () {
    // | 0 0 0 0 0 0 0 0 |
    should.deepEqual(await proxy.bitfield(testKey, ...proxy.cmdIncrbyWithOverflow('SAT', 'i8', '#0', 2)), [2]);
    // | 0 0 0 0 0 0 0 1 |

    should.deepEqual(await proxy.bitfield(testKey, ...proxy.cmdIncrbyWithOverflow('SAT', 'i8', '#0', 300)), [127]);

    should.deepEqual(await proxy.bitfield(testKey, ...proxy.cmdGet('i8', '#0')), [127]);
  });
});