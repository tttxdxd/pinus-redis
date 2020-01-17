import { IRedisBase } from "./Base";

/**
 * HyperLogLog 结构
 * 
 * HyperLogLog 是用来做基数统计的算法，HyperLogLog 的优点是，在输入元素的数量或者体积非常非常大时，计算基数所需的空间总是固定 的、并且是很小的
 * @export
 * @interface IHyperLogLog
 */
export interface IHyperLogLog extends IRedisBase {

  /**
   * 将任意数量的元素添加到指定的 HyperLogLog 里面
   *
   * @param {string} key
   * @param {string} field
   * @param {...string[]} fields
   * @returns {Promise<number>}
   * @memberof IHyperLogLog
   */
  pfadd(key: string, field: string, ...fields: string[]): Promise<number>;

  /**
   * 返回储存在给定键的 HyperLogLog 的近似基数， 如果键不存在， 那么返回 0
   *
   * @param {string} key
   * @returns {Promise<number>}
   * @memberof IHyperLogLog
   */
  pfcount(key: string): Promise<number>;

  /**
   * 将多个 HyperLogLog 合并（merge）为一个 HyperLogLog ， 合并后的 HyperLogLog 的基数接近于所有输入 HyperLogLog 的可见集合（observed set）的并集
   *
   * 合并得出的 HyperLogLog 会被储存在 destkey 键里面， 如果该键并不存在， 那么命令在执行之前， 会先为该键创建一个空的 HyperLogLog
   * @param {string} destkey
   * @param {string} key
   * @param {...string[]} keys
   * @returns {Promise<'OK'>}
   * @memberof IHyperLogLog
   */
  pfmerge(destkey: string, key: string, ...keys: string[]): Promise<'OK'>;
}