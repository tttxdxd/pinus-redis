export interface IRedisBase {

  /**
   * 检测给定的 key 是否存在 返回存在的 key 的个数
   * 
   * @param {...string[]} keys
   * @returns {Promise<number>}
   * @memberof RedisProxy
   */
  exists(...keys: string[]): Promise<number>;

  /**
   * 删除 键值对 可传入多个键名 返回成功删除键值对的个数
   * 
   * @param {...string[]} keys
   * @returns {Promise<number>}
   * @memberof RedisProxy
   */
  del(...keys: string[]): Promise<number>;
}