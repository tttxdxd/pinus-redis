import { IRedisBase } from "./Base";

export type WITHSCORES = 'WITHSCORES';

/**
 * 有序集合 可用于排行榜等
 *
 * 若要在 score 相同的情况下按时间顺序排序 可处理 score = score + timestamp
 * @export
 * @interface IRedisZset
 * @extends {IRedisBase}
 */
export interface IRedisZset extends IRedisBase {

  /**
   * 将一个或多个 member 元素及其 score 值加入到有序集 key 当中
   * 
   * 返回添加成功的个数
   * @param {string} key
   * @param {(...(string | number)[])} args
   * @returns {Promise<number>}
   * @memberof IRedisZset
   */
  zadd(key: string, member: string, score: number): Promise<number>;

  /**
   * 将一个或多个 member 元素及其 score 值加入到有序集 key 当中
   * 
   * 返回添加成功的个数
   * @param {string} key
   * @param {(...(string | number)[])} args
   * @returns {Promise<number>}
   * @memberof IRedisZset
   */
  zadd(key: string, member: string, score: number, member2: string, score2: number): Promise<number>;

  /**
   * 将一个或多个 member 元素及其 score 值加入到有序集 key 当中
   * 
   * 返回添加成功的个数
   * @param {string} key
   * @param {(...(string | number)[])} args
   * @returns {Promise<number>}
   * @memberof IRedisZset
   */
  zadd(key: string, member: string, score: number, member2: string, score2: number, member3: string, score3: number): Promise<number>;

  /**
   * 将一个或多个 member 元素及其 score 值加入到有序集 key 当中
   * 
   * 返回添加成功的个数
   * @param {string} key
   * @param {(...(string | number)[])} args
   * @returns {Promise<number>}
   * @memberof IRedisZset
   */
  zadd(key: string, ...args: (string | number)[]): Promise<number>;


  /**
   * 返回有序集 key 中，成员 member 的 score 值
   *
   * member 不存在返回 0
   * @param {string} key
   * @param {string} member
   * @returns {Promise<number>}
   * @memberof IRedisZset
   */
  zscore(key: string, member: string): Promise<number>;

  /**
   * 为有序集 key 的成员 member 的 score 值加上增量 increment
   *
   * 当 key 不存在，或 member 不是 key 的成员时， ZINCRBY key increment member 等同于 ZADD key increment member
   * 
   * score 值可以是整数值或双精度浮点数
   * @param {string} key
   * @param {number} increment 可以是整数值或双精度浮点数
   * @param {string} member
   * @returns {Promise<number>}
   * @memberof IRedisZset
   */
  zincrby(key: string, member: string, increment: number): Promise<number>

  /**
   * 返回有序集 key 的成员个数
   *
   * @param {string} key
   * @returns {Promise<number>}
   * @memberof IRedisZset
   */
  zcard(key: string): Promise<number>;


  /**
   * 返回有序集 key 中, score 值在 min 和 max 之间(默认包括 score 值等于 min 或 max )的成员的数量
   *
   * @param {string} key
   * @param {(number | string)} min
   * @param {(number | string)} max
   * @returns {Promise<number>}
   * @memberof IRedisZset
   */
  zcount(key: string, min: number | string, max: number | string): Promise<number>;


  /**
   * 返回有序集 key 中，指定区间内的成员名称。
   * 
   * 其中成员的位置按 score 值递增(从小到大)来排序。
   * 
   * 具有相同 score 值的成员按字典序(lexicographical order )来排列。
   * @param {string} key
   * @param {number} start
   * @param {number} stop
   * @returns {(Promise<(string | number)[]>)}
   * @memberof IRedisZset
   */
  zrange(key: string, start: number, stop: number): Promise<(string | number)[]>;

  /**
   * 返回有序集 key 中，指定区间内的成员名称与分数。
   * 
   * 其中成员的位置按 score 值递增(从小到大)来排序。
   * 
   * 具有相同 score 值的成员按字典序(lexicographical order )来排列。
   * @param {string} key
   * @param {number} start
   * @param {number} stop
   * @returns {(Promise<(string | number)[]>)}
   * @memberof IRedisZset
   */
  zrange(key: string, start: number, stop: number, withscores: WITHSCORES): Promise<(string | number)[]>;


  /**
   * 返回有序集 key 中，指定区间内的成员名称。
   * 
   * 其中成员的位置按 score 值递增(从大到小)来排序。
   * 
   * 具有相同 score 值的成员按字典序(lexicographical order )来排列。
   * @param {string} key
   * @param {number} start
   * @param {number} stop
   * @returns {(Promise<(string | number)[]>)}
   * @memberof IRedisZset
   */
  zrevrange(key: string, start: number, stop: number): Promise<(string | number)[]>;

  /**
   * 返回有序集 key 中，指定区间内的成员名称与分数。
   * 
   * 其中成员的位置按 score 值递增(从大到小)来排序。
   * 
   * 具有相同 score 值的成员按字典序(lexicographical order )来排列。
   * @param {string} key
   * @param {number} start
   * @param {number} stop
   * @returns {(Promise<(string | number)[]>)}
   * @memberof IRedisZset
   */
  zrevrange(key: string, start: number, stop: number, withscores: WITHSCORES): Promise<(string | number)[]>;

  /**
   * 返回有序集 key 中成员 member 的排名
   * 
   * 其中成员的位置按 score 值递增(从小到大)来排序
   * 
   * 从 0 开始, 若 member 不存在返回 null
   * @param {string} key
   * @param {string} member
   * @returns {Promise<number | null>}
   * @memberof IRedisZset
   */
  zrank(key: string, member: string): Promise<number | null>;

  /**
   * 返回有序集 key 中成员 member 的排名
   * 
   * 其中成员的位置按 score 值递增(从大到小)来排序
   * 
   * 从 0 开始, 若 member 不存在返回 null
   * @param {string} key
   * @param {string} member
   * @returns {Promise<number|null>}
   * @memberof IRedisZset
   */
  zrevrank(key: string, member: string): Promise<number | null>;


  /**
   * 移除有序集 key 中的一个或多个成员，不存在的成员将被忽略
   *
   * @param {string} key
   * @param {string} member
   * @param {...string[]} members
   * @returns {Promise<number>}
   * @memberof IRedisZset
   */
  zrem(key: string, member: string, ...members: string[]): Promise<number>
}
