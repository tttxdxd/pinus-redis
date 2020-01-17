import { IRedisBase } from "./Base";

export interface IRedisHash extends IRedisBase {

  /**
   * 将哈希表 hash 中域 field 的值设置为 value
   *
   * 当 HSET 命令在哈希表中新创建 field 域并成功为它设置值时， 命令返回 1 ； 如果域 field 已经存在于哈希表， 并且 HSET 命令成功使用新值覆盖了它的旧值， 那么命令返回 0
   * @param {string} key
   * @param {string} field
   * @param {string} value
   * @returns {Promise<number>} 0 | 1
   * @memberof IRedisHash
   */
  hset(key: string, field: string, value: string): Promise<number>;

  /**
   * 当且仅当域 field 尚未存在于哈希表的情况下， 将它的值设置为 value
   *
   * @param {string} key
   * @param {string} field
   * @param {string} value
   * @returns {Promise<number>}
   * @memberof IRedisHash
   */
  hsetnx(key: string, field: string, value: string): Promise<number>;

  /**
   * 返回哈希表中给定域的值
   *
   * @param {string} key
   * @param {string} field
   * @returns {Promise<string|null>}
   * @memberof IRedisHash
   */
  hget(key: string, field: string): Promise<string | null>;

  /**
   * 检查给定域 field 是否存在于哈希表 hash 当中
   *
   * @param {string} key
   * @param {string} field
   * @returns {Promise<number>} 0 | 1
   * @memberof IRedisHash
   */
  hexists(key: string, field: string): Promise<number>;

  /**
   * 删除哈希表 key 中的一个或多个指定域，不存在的域将被忽略
   *
   * 返回成功删除的个数
   * @param {string} key
   * @param {...string[]} fields
   * @returns {Promise<number>}
   * @memberof IRedisHash
   */
  hdel(key: string, field: string, ...fields: string[]): Promise<number>;

  /**
   * 返回哈希表 key 中域的数量
   *
   * @param {string} key
   * @returns {Promise<number>}
   * @memberof IRedisHash
   */
  hlen(key: string): Promise<number>;

  /**
   * 返回哈希表 key 中， 与给定域 field 相关联的值的字符串长度
   *
   * @param {string} key
   * @param {string} field
   * @returns {Promise<number>}
   * @memberof IRedisHash
   */
  hstrlen(key: string, field: string): Promise<number>;

  /**
   * 为哈希表 key 中的域 field 的值加上增量 increment
   *
   * @param {string} key
   * @param {string} field
   * @param {number} increment 整数
   * @returns {Promise<number>}
   * @memberof IRedisHash
   */
  hincrby(key: string, field: string, increment: number): Promise<number>;

  /**
   * 为哈希表 key 中的域 field 加上浮点数增量 increment
   *
   * @param {string} key
   * @param {string} field
   * @param {number} increment
   * @returns {Promise<number>}
   * @memberof IRedisHash
   */
  hincrbyfloat(key: string, field: string, increment: number): Promise<number>;

  /**
   * 同时将多个 field-value (域-值)对设置到哈希表 key 中
   *
   * @param {string} key
   * @param {string} field
   * @param {string} value
   * @returns {Promise<'OK'>}
   * @memberof IRedisHash
   */
  hmset(key: string, field: string, value: string): Promise<'OK'>;

  /**
   * 同时将多个 field-value (域-值)对设置到哈希表 key 中
   *
   * @param {string} key
   * @param {string} field
   * @param {string} value
   * @param {string} field2
   * @param {string} value2
   * @returns {Promise<'OK'>}
   * @memberof IRedisHash
   */
  hmset(key: string, field: string, value: string, field2: string, value2: string): Promise<'OK'>;

  /**
   * 同时将多个 field-value (域-值)对设置到哈希表 key 中
   *
   * @param {string} key
   * @param {string} field
   * @param {string} value
   * @param {...string[]} args
   * @returns {Promise<'OK'>}
   * @memberof IRedisHash
   */
  hmset(key: string, field: string, value: string, ...args: string[]): Promise<'OK'>;

  /**
   * 返回哈希表 key 中，一个或多个给定域的值
   *
   * @param {string} key
   * @param {string} field
   * @param {...string[]} fields
   * @returns {Promise<string[]>}
   * @memberof IRedisHash
   */
  hmget(key: string, field: string, ...fields: string[]): Promise<string[]>;

  /**
   * 返回哈希表 key 中的所有域
   *
   * @param {string} key
   * @returns {Promise<string[]>}
   * @memberof IRedisHash
   */
  hkeys(key: string): Promise<string[]>;

  /**
   * 返回哈希表 key 中所有域的值
   *
   * @param {string} key
   * @returns {Promise<string[]>}
   * @memberof IRedisHash
   */
  hvals(key: string): Promise<string[]>;

  /**
   * 将对象设置到哈希表 key 中
   *
   * @param {string} key
   * @param {{ [key: string]: string }} value
   * @returns {Promise<'OK'>}
   * @memberof IRedisHash
   */
  hmset(key: string, value: { [key: string]: string }): Promise<'OK'>;

  /**
   * 返回哈希表 key 中，以对象的格式所有的域和值
   *
   * @param {string} key
   * @returns {Promise<{ [key: string]: string }>}
   * @memberof IRedisHash
   */
  hgetall(key: string): Promise<{ [key: string]: string }>;
}