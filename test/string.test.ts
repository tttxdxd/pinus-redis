import "mocha";
import * as should from 'should';

import Helper from "./helper";

describe('#Redis string 字符串', function () {
  let proxy = Helper.Proxy.String;

  let testKey = 'test:key';
  let testKey2 = 'test:key2';
  let testValue = 'testValue';
  let testValue2 = 'testValue2';

  afterEach(async function () {
    await proxy.del(testKey, testKey2);
  });

  it('set', async function () {
    should.strictEqual(await proxy.set(testKey, testValue), 'OK');
  });

  it('get', async function () {
    should.strictEqual(await proxy.get(testKey), null);

    should.strictEqual(await proxy.set(testKey, testValue), 'OK');
    should.strictEqual(await proxy.get(testKey), testValue);
  });

  it('del', async function () {
    should.strictEqual(await proxy.set(testKey, testValue), 'OK');

    should.strictEqual(await proxy.del(testKey), 1);
    should.strictEqual(await proxy.get(testKey), null);
  });

  it('del 多参', async function () {
    await proxy.set(testKey, testValue);
    await proxy.set(testKey2, testValue2);

    should.strictEqual(await proxy.get(testKey), testValue);
    should.strictEqual(await proxy.get(testKey2), testValue2);

    should.strictEqual(await proxy.del(testKey, testKey2), 2);
    should.strictEqual(await proxy.get(testKey), null);
    should.strictEqual(await proxy.get(testKey2), null);
  });

  it('set px 500', async function () {
    await proxy.set(testKey, testValue, 'PX', 500);
    should.strictEqual(await proxy.get(testKey), testValue);

    await Helper.sleep(700);
    should.strictEqual(await proxy.get(testKey), null);
  });

  it('set ex 1', async function () {
    await proxy.set(testKey, testValue, 'EX', 1);

    should.strictEqual(await proxy.get(testKey), testValue);

    await Helper.sleep(1200);
    should.strictEqual(await proxy.get(testKey), null);
  });

  it('set nx 仅设置不存在的 key', async function () {
    await proxy.set(testKey, testValue, 'NX');
    should.strictEqual(await proxy.get(testKey), testValue);

    await proxy.set(testKey, testValue2, 'NX');
    should.strictEqual(await proxy.get(testKey), testValue);
  });

  it('set xx 仅设置已存在的 key', async function () {
    should.strictEqual(await proxy.set(testKey, testValue), 'OK');
    should.strictEqual(await proxy.set(testKey, testValue2, 'XX'), 'OK');
    should.strictEqual(await proxy.get(testKey), testValue2);

    should.strictEqual(await proxy.set(testKey2, testValue2, 'XX'), null);
    should.strictEqual(await proxy.get(testKey2), null);

    should.strictEqual(await proxy.del(testKey, testKey2), 1);
  });

  it('getset 设置的同时返回旧值', async function () {
    should.strictEqual(await proxy.set(testKey, testValue2), 'OK');
    should.strictEqual(await proxy.getset(testKey, testValue), testValue2);
    should.strictEqual(await proxy.get(testKey), testValue);
  });

  it('strlen', async function () {
    should.strictEqual(await proxy.set(testKey, testValue), 'OK');

    should.strictEqual(await proxy.strlen(testKey), testValue.length);
    should.strictEqual(await proxy.strlen(testKey2), 0);
  });

  it('incr', async function () {
    await proxy.del(testKey);

    should.strictEqual(await proxy.incr(testKey), 1);
    should.strictEqual(await proxy.incr(testKey), 2);
    should.strictEqual(await proxy.incr(testKey), 3);

    should.strictEqual(await proxy.incrby(testKey, 2), 5);
    should.strictEqual(await proxy.incrby(testKey, -2), 3);
    should.strictEqual(await proxy.incrby(testKey, 1112), 1115);

    should.strictEqual(await proxy.incrbyfloat(testKey, 1.1), 1116.1);
    should.strictEqual(await proxy.incrbyfloat(testKey, -1.1), 1115);

    should.strictEqual(await proxy.incrby(testKey, -1112), 3);
  });

  it('decr', async function () {
    await proxy.del(testKey);

    should.strictEqual(await proxy.decr(testKey), -1);
    should.strictEqual(await proxy.decr(testKey), -2);
    should.strictEqual(await proxy.decr(testKey), -3);

    should.strictEqual(await proxy.decrby(testKey, 2), -5);
    should.strictEqual(await proxy.decrby(testKey, -2), -3);
    should.strictEqual(await proxy.decrby(testKey, 1112), -1115);
  });

  it('mset', async function () {
    await proxy.mset(testKey, testValue, testKey2, testValue2);
    should.deepEqual(await proxy.mget(testKey, testKey2), [testValue, testValue2]);
  });

  it('msetnx 仅设置不存在的 key', async function () {
    should.deepEqual(await proxy.msetnx(testKey, testValue, testKey2, testValue2), 1);
    should.deepEqual(await proxy.mget(testKey, testKey2), [testValue, testValue2]);

    should.deepEqual(await proxy.del(testKey), 1);
    should.deepEqual(await proxy.msetnx(testKey, testValue2, testKey2, testValue), 0);
    should.deepEqual(await proxy.mget(testKey, testKey2), [null, testValue2]);
  });
});