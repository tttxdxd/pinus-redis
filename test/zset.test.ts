import "mocha";
import * as should from 'should';

import Helper from "./helper";

describe('#Redis zset 有序集合', function () {
  let proxy = Helper.Proxy.Zset;

  let testKey = 'test:key';
  let testKey2 = 'test:key2';
  let testValue = 'testValue';
  let testValue2 = 'testValue2';

  afterEach(async function () {
    await proxy.del(testKey, testKey2);
  });

  it('zadd', async function () {
    should.strictEqual(await proxy.zadd(testKey, 'a', 30, 'b', 20), 2);

    should.deepEqual(await proxy.zrange(testKey, 0, -1, 'WITHSCORES'), ['b', 20, 'a', 30]);
    should.deepEqual(await proxy.zrange(testKey, 0, -1), ['b', 'a']);

    should.deepEqual(await proxy.zrevrange(testKey, 0, -1, 'WITHSCORES'), ['a', 30, 'b', 20]);
    should.deepEqual(await proxy.zrevrange(testKey, 0, -1), ['a', 'b']);
  });

  it('zscore', async function () {
    should.strictEqual(await proxy.zadd(testKey, 'a', 30, 'b', 20), 2);

    should.strictEqual(await proxy.zscore(testKey, 'a'), 30);
    should.strictEqual(await proxy.zscore(testKey, 'c'), 0);
  });

  it('zincrby', async function () {
    should.strictEqual(await proxy.zadd(testKey, 'a', 30, 'b', 20), 2);

    should.deepEqual(await proxy.zincrby(testKey, 'a', 20), 50);
  });

  it('zcard', async function () {
    should.strictEqual(await proxy.zadd(testKey, 'a', 30, 'b', 20), 2);

    should.strictEqual(await proxy.zcard(testKey), 2);
  });

  it('zcount', async function () {
    should.strictEqual(await proxy.zadd(testKey, 'a', 30, 'b', 20), 2);

    should.strictEqual(await proxy.zcount(testKey, 0, 100), 2);
    should.strictEqual(await proxy.zcount(testKey, 20, 30), 2);
    should.strictEqual(await proxy.zcount(testKey, 21, 30), 1);
    should.strictEqual(await proxy.zcount(testKey, 21, 29), 0);
  });

  it('zrange zrevrange', async function () {
    should.strictEqual(await proxy.zadd(testKey, 'a', 30, 'b', 20), 2);

    should.deepEqual(await proxy.zrange(testKey, 0, -1, 'WITHSCORES'), ['b', 20, 'a', 30]);
    should.deepEqual(await proxy.zrange(testKey, 0, -1), ['b', 'a']);

    should.deepEqual(await proxy.zrevrange(testKey, 0, -1, 'WITHSCORES'), ['a', 30, 'b', 20]);
    should.deepEqual(await proxy.zrevrange(testKey, 0, -1), ['a', 'b']);
  });

  it('zrank zrevrank', async function () {
    should.strictEqual(await proxy.zadd(testKey, 'a', 30, 'b', 20), 2);

    should.deepEqual(await proxy.zrank(testKey, 'a'), 1);
    should.deepEqual(await proxy.zrank(testKey, 'b'), 0);

    should.deepEqual(await proxy.zrevrank(testKey, 'a'), 0);
    should.deepEqual(await proxy.zrevrank(testKey, 'b'), 1);

    should.deepEqual(await proxy.zrank(testKey, 'c'), null);
    should.deepEqual(await proxy.zrevrank(testKey, 'c'), null);
  });

  it('zrem', async function () {
    should.strictEqual(await proxy.zadd(testKey, 'a', 30, 'b', 20, 'c', 10), 3);

    should.deepEqual(await proxy.zrem(testKey, 'a'), 1);
    should.strictEqual(await proxy.zscore(testKey, 'a'), 0);
    should.strictEqual(await proxy.zscore(testKey, 'b'), 20);

    should.deepEqual(await proxy.zrem(testKey, 'a', 'b', 'c'), 2);
    should.strictEqual(await proxy.zscore(testKey, 'a'), 0);
    should.strictEqual(await proxy.zscore(testKey, 'b'), 0);
    should.strictEqual(await proxy.zscore(testKey, 'c'), 0);
  });
});