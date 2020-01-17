import "mocha";
import * as should from 'should';

import Helper from "./helper";

describe('#Redis hash 哈希表', function () {
  let proxy = Helper.Proxy.Hash;

  let testKey = 'test:key';
  let testKey2 = 'test:key2';
  let testValue = 'testValue';
  let testValue2 = 'testValue2';

  afterEach(async function () {
    await proxy.del(testKey, testKey2);
  });

  it('hset', async function () {
    should.strictEqual(await proxy.hset(testKey, 'a', '1'), 1);
  });

  it('hsetnx', async function () {
    should.strictEqual(await proxy.hsetnx(testKey, 'a', '1'), 1);

    should.strictEqual(await proxy.hsetnx(testKey, 'a', '1'), 0);
  });

  it('hget', async function () {
    should.strictEqual(await proxy.hget(testKey, 'a'), null);

    should.strictEqual(await proxy.hset(testKey, 'a', '1'), 1);
    should.strictEqual(await proxy.hget(testKey, 'a'), '1');
  });

  it('hexists', async function () {
    should.strictEqual(await proxy.hexists(testKey, 'a'), 0);

    should.strictEqual(await proxy.hset(testKey, 'a', '1'), 1);
    should.strictEqual(await proxy.hexists(testKey, 'a'), 1);
  });

  it('hdel', async function () {
    should.strictEqual(await proxy.hset(testKey, 'a', '1'), 1);
    should.strictEqual(await proxy.hset(testKey, 'b', '2'), 1);

    should.strictEqual(await proxy.hdel(testKey, 'b', 'a'), 2);
  });

  it('hlen', async function () {
    should.strictEqual(await proxy.hlen(testKey), 0);

    should.strictEqual(await proxy.hset(testKey, 'a', '1'), 1);
    should.strictEqual(await proxy.hset(testKey, 'b', '2'), 1);

    should.strictEqual(await proxy.hlen(testKey), 2);

    should.strictEqual(await proxy.hdel(testKey, 'b', '2'), 1);
    should.strictEqual(await proxy.hlen(testKey), 1);
  });

  it('hstrlen', async function () {
    should.strictEqual(await proxy.hset(testKey, 'a', '1'), 1);
    should.strictEqual(await proxy.hstrlen(testKey, 'a'), 1);

    should.strictEqual(await proxy.hset(testKey, 'a', '1111'), 0);
    should.strictEqual(await proxy.hstrlen(testKey, 'a'), 4);
  });

  it('hincrby hincrbyfloat', async function () {
    should.strictEqual(await proxy.hset(testKey, 'a', '10'), 1);

    should.strictEqual(await proxy.hincrby(testKey, 'a', 1), 11);

    should.strictEqual(await proxy.hincrbyfloat(testKey, 'a', 1.1), 12.1);
  });

  it('hmget', async function () {
    should.strictEqual(await proxy.hset(testKey, 'a', '1'), 1);
    should.strictEqual(await proxy.hset(testKey, 'b', '2'), 1);

    should.deepEqual(await proxy.hmget(testKey, 'a', 'b', 'c'), ['1', '2', null]);
  });

  it('hset', async function () {
    should.strictEqual(await proxy.hmset(testKey, 'a', '1', 'b', '2'), 'OK');

    should.deepEqual(await proxy.hmget(testKey, 'a', 'b', 'c'), ['1', '2', null]);
  });

  it('hkeys', async function () {
    should.strictEqual(await proxy.hmset(testKey, 'b', '1', 'a', '2'), 'OK');

    should.deepEqual(await proxy.hkeys(testKey), ['b', 'a']);
  });

  it('hvals', async function () {
    should.strictEqual(await proxy.hmset(testKey, 'b', '1', 'a', '2'), 'OK');

    should.deepEqual(await proxy.hvals(testKey), ['1', '2']);
  });

  it('hmset 可设置对象', async function () {
    let obj = { a: '1', b: '2' };
    should.strictEqual(await proxy.hmset(testKey, obj), 'OK');

    should.strictEqual(await proxy.hget(testKey, 'a'), '1');
    should.strictEqual(await proxy.hget(testKey, 'b'), '2');
  });

  it('hgetall 可返回对象', async function () {
    let obj = { a: '1', b: '2', c: '3' };
    should.strictEqual(await proxy.hmset(testKey, obj), 'OK');

    should.deepEqual(await proxy.hgetall(testKey), obj);
  });
});