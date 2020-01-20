import "mocha";
import * as should from 'should';

import Helper from "./helper";

describe('#Redis pipeline', function () {
  let proxy = Helper.Proxy;

  let testKey = 'test:key';
  let testKey2 = 'test:key2';
  let testValue = 'testValue';
  let testValue2 = 'testValue2';

  afterEach(async function () {
    await proxy.del(testKey, testKey2);
  });

  it('pipeline', async function () {
    let res = await proxy.multi().set(testKey, testValue).set(testKey2, testValue2).get(testKey).execAsync();

    should.deepEqual(res, ['OK', 'OK', testValue]);
  });
});