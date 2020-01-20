export interface IRedisBase {

  ping(...args: string[]): Promise<'PONG'>;

  /**
   * 检测给定的 key 是否存在 返回存在的 key 的个数
   * 
   * @param {...string[]} keys
   * @returns {Promise<number>}
   * @memberof RedisProxy
   */
  exists(key: string, ...keys: string[]): Promise<number>;

  /**
   * 删除 键值对 可传入多个键名 返回成功删除键值对的个数
   * 
   * @param {...string[]} keys
   * @returns {Promise<number>}
   * @memberof RedisProxy
   */
  del(key: string, ...keys: string[]): Promise<number>;

  //#region expire

  /**
   * 为给定 key 设置生存时间，当 key 过期时(生存时间为 0 )，它会被自动删除
   *
   * 设置成功 返回 1 设置失败（key 不存在） 返回 0
   * @param {string} key
   * @param {number} seconds 秒数
   * @returns {Promise<number>} 0 | 1
   * @memberof RedisProxy
   */
  expire(key: string, seconds: number): Promise<number>;

  /**
   * 为给定 key 设置生存时间戳 ，当 key 过期时(生存时间为 0 )，它会被自动删除
   *
   * UNIX 时间戳(unix timestamp) 精确到秒
   * 
   * 设置成功 返回 1 设置失败（key 不存在） 返回 0
   * @param {string} key
   * @param {number} timestamp 1355292000 -- 2012-12-12T06:00:00
   * @returns {Promise<number>}
   * @memberof IRedisBase
   */
  expireat(key: string, timestamp: number): Promise<number>;


  /**
   * 以秒为单位，返回给定 key 的剩余生存时间(TTL, time to live)
   *
   * @param {string} key
   * @returns {Promise<number>}
   * @memberof IRedisBase
   */
  ttl(key: string): Promise<number>;


  /**
   * 移除给定 key 的生存时间，将这个 key 从“易失的”(带生存时间 key )转换成“持久的”(一个不带生存时间、永不过期的 key )
   *
   * @param {string} key
   * @returns {Promise<number>}
   * @memberof IRedisBase
   */
  persist(key: string): Promise<number>;

  /**
   * 这个命令和 EXPIRE 命令的作用类似，但是它以毫秒为单位设置 key 的生存时间，而不像 EXPIRE 命令那样，以秒为单位
   *
   * @param {string} key
   * @param {number} milliseconds
   * @returns {Promise<number>}
   * @memberof IRedisBase
   */
  pexpire(key: string, milliseconds: number): Promise<number>;

  /**
   * 这个命令和 expireat 命令类似，但它以毫秒为单位设置 key 的过期 unix 时间戳，而不是像 expireat 那样，以秒为单位
   *
   * @param {string} key
   * @param {number} millisecondsTimestamp
   * @returns {Promise<number>}
   * @memberof IRedisBase
   */
  pexpireat(key: string, millisecondsTimestamp: number): Promise<number>;

  /**
   * 这个命令类似于 TTL 命令，但它以毫秒为单位返回 key 的剩余生存时间，而不是像 TTL 命令那样，以秒为单位
   *
   * @param {string} key
   * @returns {Promise<number>}
   * @memberof IRedisBase
   */
  pttl(key: string): Promise<number>;

  //#endregion
}
