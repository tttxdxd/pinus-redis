import "mocha";
import * as should from 'should';

import Helper from "./helper";

describe('#Redis list 列表', function () {
  let proxy = Helper.Proxy.List;

  let testKey = 'test:key';
  let testKey2 = 'test:key2';
  let testValue = 'testValue';
  let testValue2 = 'testValue2';

  afterEach(async function () {
    await proxy.del(testKey, testKey2);
  });

  it('lpush', async function () {
    should.strictEqual(await proxy.lpush(testKey, '1'), 1);
    should.strictEqual(await proxy.lpush(testKey, '2', '3'), 3);
    should.strictEqual(await proxy.lpush(testKey, '2', '3'), 5);
  });

  it('lpushx', async function () {
    should.strictEqual(await proxy.lpushx(testKey, '1'), 0);

    should.strictEqual(await proxy.lpush(testKey, '1'), 1);
    should.strictEqual(await proxy.lpushx(testKey, '2'), 2);
  });

  it('rpush', async function () {
    should.strictEqual(await proxy.rpush(testKey, '1'), 1);
    should.strictEqual(await proxy.rpush(testKey, '2', '3'), 3);
    should.strictEqual(await proxy.rpush(testKey, '2', '3'), 5);
  });

  it('rpushx', async function () {
    should.strictEqual(await proxy.rpushx(testKey, '1'), 0);

    should.strictEqual(await proxy.rpush(testKey, '1'), 1);
    should.strictEqual(await proxy.rpushx(testKey, '2'), 2);
  });

  it('lpop', async function () {
    should.strictEqual(await proxy.lpush(testKey, '1'), 1);

    should.strictEqual(await proxy.lpop(testKey), '1');
    should.strictEqual(await proxy.lpop(testKey), null);
  });

  it('rpop', async function () {
    should.strictEqual(await proxy.rpush(testKey, '1'), 1);

    should.strictEqual(await proxy.rpop(testKey), '1');
    should.strictEqual(await proxy.rpop(testKey), null);
  });

  it('rpoplpush', async function () {
    should.strictEqual(await proxy.rpush(testKey, '1', '1', '2', '3', '3', '3'), 6);

    should.strictEqual(await proxy.rpoplpush(testKey, testKey2), '3');
    should.strictEqual(await proxy.rpop(testKey2), '3');
  });

  it('lrem', async function () {
    should.strictEqual(await proxy.lpush(testKey, '1', '1', '2', '3', '3', '3'), 6);

    should.strictEqual(await proxy.lrem(testKey, 1, '1'), 1);
    should.strictEqual(await proxy.lrem(testKey, 0, '3'), 3);
  });

  it('llen', async function () {
    should.strictEqual(await proxy.lpush(testKey, '1', '2', '3', '3', '3'), 5);

    should.strictEqual(await proxy.lrem(testKey, 1, '1'), 1);
    should.strictEqual(await proxy.llen(testKey), 4);
  });

  it('lindex', async function () {
    should.strictEqual(await proxy.rpush(testKey, '1', '2', '3', '3', '3'), 5);

    should.strictEqual(await proxy.lindex(testKey, 0), '1');
    should.strictEqual(await proxy.lindex(testKey, 1), '2');
    should.strictEqual(await proxy.lindex(testKey, 3), '3');
  });

  it('linsert', async function () {
    should.strictEqual(await proxy.rpush(testKey, '1', '2', '3', '3', '3'), 5);

    should.strictEqual(await proxy.linsert(testKey, 'BEFORE', '2', '6'), 6);

    should.strictEqual(await proxy.lindex(testKey, 1), '6');
    should.strictEqual(await proxy.lindex(testKey, 2), '2');
  });

  it('lset', async function () {
    should.strictEqual(await proxy.rpush(testKey, '1', '2', '3', '3', '3'), 5);

    should.strictEqual(await proxy.lindex(testKey, 1), '2');
    should.strictEqual(await proxy.lset(testKey, 1, '3'), 'OK');
    should.strictEqual(await proxy.lindex(testKey, 1), '3');
  });

  it('lrange', async function () {
    should.strictEqual(await proxy.rpush(testKey, '1', '2', '3', '3', '3'), 5);

    should.deepEqual(await proxy.lrange(testKey, 0, -1), ['1', '2', '3', '3', '3']);
  });

  it('ltrim', async function () {
    should.strictEqual(await proxy.rpush(testKey, '1', '2', '3', '3', '3'), 5);

    should.strictEqual(await proxy.ltrim(testKey, 0, 2), 'OK');
    should.deepEqual(await proxy.lrange(testKey, 0, -1), ['1', '2', '3']);
  });

  it('blpop', async function () {
    let values = ['1', '2', '3', '3', '3'];
    should.strictEqual(await proxy.rpush(testKey, ...values), values.length);

    for (let i = 0; i < values.length; i++) {
      should.deepEqual(await proxy.blpop(testKey, 1), [testKey, values[i]]);
    }
  });

  it('brpop', async function () {
    let values = ['1', '2', '3', '3', '3'];
    should.strictEqual(await proxy.rpush(testKey, ...values), values.length);

    for (let i = 0; i < values.length; i++) {
      should.deepEqual(await proxy.brpop(testKey, 1), [testKey, values[values.length - i - 1]]);
    }
  });

  it('brpoplpush', async function () {
    let values = ['1', '2', '3', '3', '3'];
    should.strictEqual(await proxy.rpush(testKey, ...values), values.length);

    for (let i = 0; i < values.length; i++) {
      should.deepEqual(await proxy.brpoplpush(testKey, testKey, 1), values[values.length - i - 1]);
    }
  });
});