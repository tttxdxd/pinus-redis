import "mocha";
import * as should from 'should';

import Helper from "./helper";

describe('#Redis HyperLogLog', function () {
  let proxy = Helper.Proxy.HyperLogLog;

  let testKey = 'test:key';
  let testKey2 = 'test:key2';
  let destKey = 'test:destKey';
  let testValue = 'testValue';
  let testValue2 = 'testValue2';

  afterEach(async function () {
    await proxy.del(testKey, testKey2, destKey);
  });

  it('pfadd', async function () {
    should.strictEqual(await proxy.pfadd(testKey, testValue, testValue2), 1);
  });

  it('pfcount', async function () {
    should.strictEqual(await proxy.pfcount(testKey), 0);

    should.strictEqual(await proxy.pfadd(testKey, testValue), 1);
    should.strictEqual(await proxy.pfcount(testKey), 1);

    should.strictEqual(await proxy.pfadd(testKey, testValue2), 1);
    should.strictEqual(await proxy.pfcount(testKey), 2);
  });

  it('pfmerge', async function () {
    should.strictEqual(await proxy.pfadd(testKey, testValue), 1);
    should.strictEqual(await proxy.pfadd(testKey2, testValue2), 1);

    should.strictEqual(await proxy.pfcount(testKey), 1);
    should.strictEqual(await proxy.pfcount(testKey2), 1);

    should.strictEqual(await proxy.pfmerge(destKey, testKey, testKey2), 'OK');
    should.strictEqual(await proxy.pfcount(destKey), 2);
  });
});