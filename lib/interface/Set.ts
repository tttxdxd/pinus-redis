import { IRedisBase } from "./Base";

export interface IRedisSet extends IRedisBase {

  /**
   * 将一个或多个 member 元素加入到集合 key 当中，已经存在于集合的 member 元素将被忽略
   * 
   * 返回 添加成功的个数
   * @param {string} key
   * @param {...string[]} members
   * @returns {Promise<number>}
   * @memberof IRedisSet
   */
  sadd(key: string, ...members: string[]): Promise<number>;

  /**
   * 判断 member 元素是否集合 key 的成员
   *
   * @param {string} key
   * @param {string} member
   * @returns {Promise<number>} 0 | 1
   * @memberof IRedisSet
   */
  sismember(key: string, member: string): Promise<number>;

  /**
   * 移除并返回集合中的一个随机元素
   *
   * @param {string} key
   * @returns {Promise<string>}
   * @memberof IRedisSet
   */
  spop(key: string): Promise<string>;

  /**
   * 如果命令执行时，只提供了 key 参数，那么返回集合中的一个随机元素
   *
   * @param {string} key
   * @returns {Promise<string>}
   * @memberof IRedisSet
   */
  srandmember(key: string): Promise<string>;

  /**
   * 如果命令执行时，只提供了 key 参数，那么返回集合中的一个随机元素 redis >= 2.6
   *
   * - 如果 count 为正数，且小于集合基数，那么命令返回一个包含 count 个元素的数组，数组中的元素各不相同。如果 count 大于等于集合基数，那么返回整个集合。
   * 
   * - 如果 count 为负数，那么命令返回一个数组，数组中的元素可能会重复出现多次，而数组的长度为 count 的绝对值
   * @param {string} key
   * @returns {Promise<string>}
   * @memberof IRedisSet
   */
  srandmember(key: string, count: number): Promise<string[]>;

  /**
   * 移除集合 key 中的一个或多个 member 元素，不存在的 member 元素会被忽略
   *
   * @param {string} key
   * @param {string[]} members
   * @returns {Promise<number>}
   * @memberof IRedisSet
   */
  srem(key: string, ...members: string[]): Promise<number>;

  /**
   * 将 member 元素从 source 集合移动到 destination 集合
   *
   * @param {string} source
   * @param {string} destination
   * @param {string} member
   * @returns {Promise<number>}
   * @memberof IRedisSet
   */
  smove(source: string, destination: string, member: string): Promise<number>;

  /**
   * 返回集合 key 的基数(集合中元素的数量)
   *
   * @param {string} key
   * @returns {Promise<number>}
   * @memberof IRedisSet
   */
  scard(key: string): Promise<number>;

  /**
   * 返回集合 key 中的所有成员
   *
   * @param {string} key
   * @returns {Promise<string[]>}
   * @memberof IRedisSet
   */
  smembers(key: string): Promise<string[]>;

  /**
   * 返回一个集合的全部成员，该集合是所有给定集合的交集
   *
   * @param {string} key
   * @param {...string[]} keys
   * @returns {Promise<string[]>}
   * @memberof IRedisSet
   */
  sinter(key: string, ...keys: string[]): Promise<string[]>;

  /**
   * 这个命令类似于 SINTER key [key …] 命令，但它将结果保存到 destination 集合，而不是简单地返回结果集
   *
   * 如果 destination 集合已经存在，则将其覆盖
   * 
   * destination 可以是 key 本身
   * @param {string} key
   * @param {...string[]} keys
   * @returns {Promise<number>} 返回 destination 内的元素个数
   * @memberof IRedisSet
   */
  sinterstore(destination: string, key: string, ...keys: string[]): Promise<number>;

  /**
   * 返回一个集合的全部成员，该集合是所有给定集合的并集
   *
   * @param {string} key
   * @param {...string[]} keys
   * @returns {Promise<string[]>}
   * @memberof IRedisSet
   */
  sunion(key: string, ...keys: string[]): Promise<string[]>;

  /**
   * 这个命令类似于 SUNION key [key …] 命令，但它将结果保存到 destination 集合，而不是简单地返回结果集
   *
   * 如果 destination 集合已经存在，则将其覆盖
   * 
   * destination 可以是 key 本身
   * @param {string} key
   * @param {...string[]} keys
   * @returns {Promise<number>}
   * @memberof IRedisSet
   */
  sunionstore(destination: string, key: string, ...keys: string[]): Promise<number>;

  /**
   * 返回一个集合的全部成员，该集合是所有给定集合之间的差集
   *
   * @param {string} key
   * @param {...string[]} keys
   * @returns {Promise<string[]>}
   * @memberof IRedisSet
   */
  sdiff(key: string, ...keys: string[]): Promise<string[]>;

  /**
   * 这个命令的作用和 SDIFF key [key …] 类似，但它将结果保存到 destination 集合，而不是简单地返回结果集
   *
   * 如果 destination 集合已经存在，则将其覆盖
   * 
   * destination 可以是 key 本身
   * @param {string} key
   * @param {...string[]} keys
   * @returns {Promise<number>}
   * @memberof IRedisSet
   */
  sdiffstore(destination: string, key: string, ...keys: string[]): Promise<number>;
}