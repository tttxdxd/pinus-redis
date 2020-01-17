import { RedisProxy } from "../lib/redis";

export default class Helper {
  private static instance: RedisProxy;

  public static sleep(timeout): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }

  public static get Proxy(): RedisProxy {
    if (!Helper.instance) {
      Helper.instance = new RedisProxy();
    }
    return Helper.instance;
  }

  public static async waitForSeconds(cb: Function, timeout: number) {
    await Helper.sleep(timeout);
    if (typeof cb === 'function') {
      cb();
    }
  }
};