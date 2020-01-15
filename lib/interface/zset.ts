import { IRedisBase } from "./base";

export type WITHSCORES = 'WITHSCORES';

export interface IRedisZset extends IRedisBase {

  /**
   * 删除 键值对 可传入多个键名 返回成功删除键值对的个数
   *
   * @param {...string[]} keys
   * @returns {Promise<number>}
   * @memberof RedisProxy
   */
  del(...keys: string[]): Promise<number>;

  zadd(key: string, ...args: (string | number)[]): Promise<number>;

  zscore(key: string, member: string): Promise<string>;
  zcard(key: string): Promise<number>;
  zcount(key: string, min: number | string, max: number | string): Promise<number>;

  zrange(key: string, start: number, stop: number): Promise<string[]>;
  zrange(key: string, start: number, stop: number, withscores: WITHSCORES): Promise<string[]>;

  zrevrange(key: string, start: number, stop: number): Promise<string[]>;
  zrevrange(key: string, start: number, stop: number, withscores: WITHSCORES): Promise<string[]>;

}