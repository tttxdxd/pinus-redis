import "mocha";
import * as should from 'should';

import { RedisProxy } from "../lib/redis";

describe('#Redis zset 有序集合', function () {
  let proxy = new RedisProxy().zset;

  let testKey = 'test:key';
  let testKey2 = 'test:key2';
  let testValue = 'testValue';
  let testValue2 = 'testValue2';

  after(async function () {
    await proxy.del(testKey, testKey2);
  });

  it('zadd', async function () {
    await proxy.zadd(testKey, 30, 'a', 20, 'b');

    should.deepEqual(await proxy.zrange(testKey, 0, -1, 'WITHSCORES'), ['b', '20', 'a', '30']);
    should.deepEqual(await proxy.zrange(testKey, 0, -1), ['b', 'a']);

    should.deepEqual(await proxy.zrevrange(testKey, 0, -1, 'WITHSCORES'), ['a', '30', 'b', '20']);
    should.deepEqual(await proxy.zrevrange(testKey, 0, -1), ['a', 'b']);
  });

  it('zcard', async function () {
    should.equal(await proxy.zcard(testKey), 2);
  });

  it('zcount', async function () {
    should.equal(await proxy.zcount(testKey, 0, 100), 2);
    should.equal(await proxy.zcount(testKey, 20, 30), 2);
    should.equal(await proxy.zcount(testKey, 21, 30), 1);
    should.equal(await proxy.zcount(testKey, 21, 29), 0);
  });
});

function sleep(timeout): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}