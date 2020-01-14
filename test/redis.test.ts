import "mocha";
import * as should from 'should';

import { RedisProxy } from "../lib/redis";

describe('#RedisProxy', function () {
  let proxy = new RedisProxy();

  before(function (done: MochaDone) {
    proxy.init().then(() => {
      done();
    });
  });

  let testKey = 'test:key';
  let testKey2 = 'test:key2';
  let testValue = 'testValue';
  let testValue2 = 'testValue2';

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


});

function sleep(timeout): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}