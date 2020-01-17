import "mocha";
import * as should from 'should';

import Helper from "./helper";

describe('#Redis list 列表', function () {
  let proxy = Helper.Proxy.Set;

  let testKey = 'test:key';
  let testKey2 = 'test:key2';
  let testValue = 'testValue';
  let testValue2 = 'testValue2';
  let destination = 'test:destination';

  afterEach(async function () {
    await proxy.del(testKey, testKey2);
  });

  it('sadd', async function () {
    should.strictEqual(await proxy.sadd(testKey, '1'), 1);

    should.strictEqual(await proxy.sadd(testKey, '1'), 0);

    should.strictEqual(await proxy.sadd(testKey, '1', '2', '3', '4', '5', '5', '5'), 4);
  });

  it('sismember', async function () {
    should.strictEqual(await proxy.sadd(testKey, '1', '2', '3', '4', '5', '5', '5'), 5);

    should.strictEqual(await proxy.sismember(testKey, '1'), 1);
    should.strictEqual(await proxy.sismember(testKey, '11'), 0);
  });

  it('spop', async function () {
    let res = ['1', '2', '3', '4', '5'];
    should.strictEqual(await proxy.sadd(testKey, ...res), 5);

    should.strictEqual(res.includes(await proxy.spop(testKey)), true);
  });

  it('srandmember', async function () {
    let res = ['1', '2', '3', '4', '5'];
    should.strictEqual(await proxy.sadd(testKey, ...res), 5);

    should.strictEqual(res.includes(await proxy.srandmember(testKey)), true);

    should.strictEqual((await proxy.srandmember(testKey, 3)).length, 3);
    should.strictEqual((await proxy.srandmember(testKey, 13)).length, 5);
    should.strictEqual((await proxy.srandmember(testKey, -13)).length, 13);
  });

  it('srem', async function () {
    should.strictEqual(await proxy.sadd(testKey, '1', '2', '3', '4', '5', '5', '5'), 5);

    should.strictEqual(await proxy.srem(testKey, '1'), 1);
    should.strictEqual(await proxy.srem(testKey, '1'), 0);
    should.strictEqual(await proxy.srem(testKey, '1', '2', '3'), 2);
  });

  it('smove', async function () {
    should.strictEqual(await proxy.sadd(testKey, '1', '2', '3', '4', '5', '5', '5'), 5);

    should.strictEqual(await proxy.smove(testKey, testKey2, '1'), 1);

    should.strictEqual(await proxy.sismember(testKey, '1'), 0);
    should.strictEqual(await proxy.sismember(testKey2, '1'), 1);
  });

  it('smove', async function () {
    should.strictEqual(await proxy.sadd(testKey, '1', '2', '3', '4', '5', '5', '5'), 5);

    should.strictEqual(await proxy.scard(testKey), 5);
  });

  it('smembers', async function () {
    should.strictEqual(await proxy.sadd(testKey, '1', '2', '3', '4', '5', '5', '5'), 5);

    should.deepEqual(await proxy.smembers(testKey), ['1', '2', '3', '4', '5']);

    should.deepEqual(await proxy.smembers(testKey2), []);
  });

  it('sinter', async function () {
    should.strictEqual(await proxy.sadd(testKey, '1', '2', '3', '4', '5', '5', '5'), 5);
    should.strictEqual(await proxy.sadd(testKey2, '1', '7', '8'), 3);

    should.deepEqual(await proxy.sinter(testKey), ['1', '2', '3', '4', '5']);
    should.deepEqual(await proxy.sinter(testKey, testKey2), ['1']);
  });

  it('sinterstore', async function () {
    should.strictEqual(await proxy.sadd(testKey, '1', '2', '3', '4', '5', '5', '5'), 5);
    should.strictEqual(await proxy.sadd(testKey2, '1', '7', '8'), 3);

    should.deepEqual(await proxy.sinterstore(destination, testKey), 5);
    should.deepEqual(await proxy.sinterstore(destination, testKey, testKey2), 1);
  });

  it('sunion', async function () {
    should.strictEqual(await proxy.sadd(testKey, '1', '2', '3', '4', '5', '5', '5'), 5);
    should.strictEqual(await proxy.sadd(testKey2, '1', '7', '8'), 3);

    should.deepEqual(await proxy.sunion(testKey), ['1', '2', '3', '4', '5']);
    should.deepEqual(await proxy.sunion(testKey, testKey2), ['1', '2', '3', '4', '5', '7', '8']);
  });

  it('sunionstore', async function () {
    should.strictEqual(await proxy.sadd(testKey, '1', '2', '3', '4', '5', '5', '5'), 5);
    should.strictEqual(await proxy.sadd(testKey2, '1', '7', '8'), 3);

    should.deepEqual(await proxy.sunionstore(destination, testKey), 5);
    should.deepEqual(await proxy.sunionstore(destination, testKey, testKey2), 7);
  });

  it('sdiff', async function () {
    should.strictEqual(await proxy.sadd(testKey, '1', '2', '3', '4', '5', '5', '5'), 5);
    should.strictEqual(await proxy.sadd(testKey2, '1', '7', '8'), 3);

    should.deepEqual(await proxy.sdiff(testKey), ['1', '2', '3', '4', '5']);
    should.deepEqual(await proxy.sdiff(testKey, testKey2), ['2', '3', '4', '5']);
  });

  it('sinterstore', async function () {
    should.strictEqual(await proxy.sadd(testKey, '1', '2', '3', '4', '5', '5', '5'), 5);
    should.strictEqual(await proxy.sadd(testKey2, '1', '7', '8'), 3);

    should.deepEqual(await proxy.sdiffstore(destination, testKey), 5);
    should.deepEqual(await proxy.sdiffstore(destination, testKey, testKey2), 4);
    should.deepEqual(await proxy.sdiffstore(destination, testKey2, testKey), 2);
  });
});