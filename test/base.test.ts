import "mocha";
import * as should from 'should';

import Helper from "./helper";

describe('#Redis 基础', function () {
  let proxy = Helper.Proxy;

  let testKey = 'test:key';
  let testKey2 = 'test:key2';
  let testValue = 'testValue';
  let testValue2 = 'testValue2';

  afterEach(async function () {
    await proxy.del(testKey, testKey2);
  });

  it('ping', async function () {
    should.strictEqual(await proxy.ping(), 'PONG');
  });

  it('exists', async function () {
    should.strictEqual(await proxy.set(testKey, testValue), 'OK');

    should.strictEqual(await proxy.exists(testKey), 1);
    should.strictEqual(await proxy.exists(testKey2), 0);
    should.strictEqual(await proxy.exists(testKey, testKey2), 1);
  });

  it('del', async function () {
    should.strictEqual(await proxy.set(testKey, testValue), 'OK');
    should.strictEqual(await proxy.exists(testKey), 1);

    should.strictEqual(await proxy.del(testKey), 1);
    should.strictEqual(await proxy.exists(testKey), 0);
  });

  it('expire', async function () {
    should.strictEqual(await proxy.expire(testKey, 1), 0);

    should.strictEqual(await proxy.set(testKey, testValue), 'OK');
    should.strictEqual(await proxy.expire(testKey, 1), 1);

    await Helper.sleep(1200);
    should.strictEqual(await proxy.exists(testKey), 0);
  });

  it('expireat', async function () {
    let nextSecond = Math.floor(Date.now() / 1000) + 1;
    should.strictEqual(await proxy.expireat(testKey, nextSecond), 0);

    should.strictEqual(await proxy.set(testKey, testValue), 'OK');
    should.strictEqual(await proxy.expireat(testKey, nextSecond), 1);

    await Helper.sleep(1200);
    should.strictEqual(await proxy.exists(testKey), 0);
  });

  it('ttl', async function () {
    should.strictEqual(await proxy.expire(testKey, 1), 0);

    should.strictEqual(await proxy.set(testKey, testValue), 'OK');
    should.strictEqual(await proxy.expire(testKey, 1), 1);

    should.strictEqual(await proxy.ttl(testKey) > 0, true);
  });
});