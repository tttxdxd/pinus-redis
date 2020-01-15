import "mocha";
import * as should from 'should';

import { RedisProxy } from "../lib/redis";

describe('#Redis string 字符串', function () {
  let proxy = new RedisProxy().string;

  let testKey = 'test:key';
  let testKey2 = 'test:key2';
  let testValue = 'testValue';
  let testValue2 = 'testValue2';

  after(async function () {
    await proxy.del(testKey, testKey2);
  });

  it('set', function (done: MochaDone) {
    proxy.set(testKey, testValue).then(res => {
      should.equal(res, 'OK');
      done();
    });
  });

  it('get', async function () {
    should.equal(await proxy.get(testKey), testValue);
  });

  it('del', async function () {
    should.equal(await proxy.del(testKey), 1);
    should.equal(await proxy.get(testKey), null);
  });

  it('del 多参', async function () {
    await proxy.set(testKey, testValue);
    await proxy.set(testKey2, testValue2);

    should.equal(await proxy.get(testKey), testValue);
    should.equal(await proxy.get(testKey2), testValue2);

    should.equal(await proxy.del(testKey, testKey2), 2);
    should.equal(await proxy.get(testKey), null);
    should.equal(await proxy.get(testKey2), null);
  });

  it('set px 500', async function () {
    await proxy.set(testKey, testValue, 'PX', 500);
    should.equal(await proxy.get(testKey), testValue);

    await sleep(700);
    should.equal(await proxy.get(testKey), null);
  });

  it('set ex 1', async function () {
    await proxy.set(testKey, testValue, 'EX', 1);

    should.equal(await proxy.get(testKey), testValue);

    await sleep(1200);
    should.equal(await proxy.get(testKey), null);
  });

  it('set nx 仅设置不存在的 key', async function () {
    await proxy.set(testKey, testValue, 'NX');
    should.equal(await proxy.get(testKey), testValue);

    await proxy.set(testKey, testValue2, 'NX');
    should.equal(await proxy.get(testKey), testValue);
  });

  it('set xx 仅设置已存在的 key', async function () {
    await proxy.set(testKey, testValue2, 'XX');
    should.equal(await proxy.get(testKey), testValue2);

    await proxy.set(testKey2, testValue2, 'XX');
    should.equal(await proxy.get(testKey2), null);

    should.equal(await proxy.del(testKey, testKey2), 1);
  });

  it('getset 设置的同时返回旧值', async function () {
    should.equal(await proxy.set(testKey, testValue2), 'OK');
    should.equal(await proxy.getset(testKey, testValue), testValue2);
    should.equal(await proxy.get(testKey), testValue);
  });

  it('strlen', async function () {
    should.equal(await proxy.strlen(testKey), testValue.length);
  });

  it('incr', async function () {
    await proxy.del(testKey);

    should.equal(await proxy.incr(testKey), 1);
    should.equal(await proxy.incr(testKey), 2);
    should.equal(await proxy.incr(testKey), 3);

    should.equal(await proxy.incrby(testKey, 2), 5);
    should.equal(await proxy.incrby(testKey, -2), 3);
    should.equal(await proxy.incrby(testKey, 1112), 1115);

    should.equal(await proxy.incrbyfloat(testKey, 1.1), 1116.1);
    should.equal(await proxy.incrbyfloat(testKey, -1.1), 1115);

    should.equal(await proxy.incrby(testKey, -1112), 3);
  });

  it('decr', async function () {
    await proxy.del(testKey);

    should.equal(await proxy.decr(testKey), -1);
    should.equal(await proxy.decr(testKey), -2);
    should.equal(await proxy.decr(testKey), -3);

    should.equal(await proxy.decrby(testKey, 2), -5);
    should.equal(await proxy.decrby(testKey, -2), -3);
    should.equal(await proxy.decrby(testKey, 1112), -1115);
  });

  it('mset', async function () {
    await proxy.mset(testKey, testValue, testKey2, testValue2);
    should.deepEqual(await proxy.mget(testKey, testKey2), [testValue, testValue2]);
  });

  it('msetnx', async function () {
    await proxy.msetnx(testKey, testValue2, testKey2, testValue);
    should.deepEqual(await proxy.mget(testKey, testKey2), [testValue, testValue2]);

    await proxy.del(testKey, testKey2);
    await proxy.msetnx(testKey, testValue2, testKey2, testValue);
    should.deepEqual(await proxy.mget(testKey, testKey2), [testValue2, testValue]);
  })
});

function sleep(timeout): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}