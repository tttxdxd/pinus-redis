import { IRedisBase } from "./Base";

//   NX = 'NX',                  // 仅设置不存在的密钥。
//   XX = 'XX',                  // 仅设置已存在的密钥。
//   KEEPTTL = 'KEEPTTL'         // 保留与钥匙关联的生存时间。 redis >= 6.0：添加了该KEEPTTL选项。
export type Mode = 'NX' | 'XX' | 'KEEPTTL';

//   EX = 'EX',                  // 设置指定的终止时间，以秒为单位。
//   PX = 'PX',                  // 设置指定的终止时间，以毫秒为单位。
export type ExpireMode = 'EX' | 'PX';

//   WRITE = 'write',            // 命令可能会导致修改
//   DENYOON = 'denyoom'         // 如果当前是OOM，则拒绝命令
export type Flag = 'write' | 'denyoom';

export interface IRedisString extends IRedisBase {

  /**
   * 根据键名设置对应值 成功返回 OK
   *
   * @param {string} key
   * @param {string} value
   * @returns {Promise<'OK'>}
   * @memberof RedisProxy
   */
  set(key: string, value: string): Promise<'OK'>;

  /**
   * 根据键名设置对应值 可传入标记 成功返回 OK
   *
   * @param {string} key
   * @param {string} value
   * @param {Flag} flag write(命令可能会导致修改) | denyoom(如果当前是OOM，则拒绝命令)
   * @returns {Promise<'OK'>}
   * @memberof RedisProxy
   */
  set(key: string, value: string, flag: Flag): Promise<'OK'>;

  /**
   * 根据键名设置对应值 可传入设置模式 成功返回 OK
   *
   * @param {string} key
   * @param {string} value
   * @param {Mode} mode NX | XX | KEEPTTL
   * @returns {Promise<'OK'>}
   * @memberof RedisProxy
   */
  set(key: string, value: string, mode: Mode): Promise<'OK'>;

  /**
   * 根据键名设置对应值 可传入设置模式和剩余时间 成功返回 OK
   *
   * @param {string} key
   * @param {string} value
   * @param {ExpireMode} mode  EX | PX
   * @param {number} duration
   * @returns {Promise<'OK' | undefined>}
   * @memberof RedisProxy
   */
  set(key: string, value: string, mode: ExpireMode, duration: number): Promise<'OK' | undefined>;

  /**
   * 根据键名设置对应值 可传入设置模式和剩余时间和标记 成功返回 OK
   *
   * @param {string} key
   * @param {string} value
   * @param {ExpireMode} mode EX | PX
   * @param {number} duration
   * @param {Flag} flag write(命令可能会导致修改) | denyoom(如果当前是OOM，则拒绝命令)
   * @returns {Promise<'OK' | undefined>}
   * @memberof RedisProxy
   */
  set(key: string, value: string, mode: ExpireMode, duration: number, flag: Flag): Promise<'OK' | undefined>;

  /**
   * 根据键名获取对应值
   *
   * @param {string} key
   * @returns {Promise<string>}
   * @memberof RedisProxy
   */
  get(key: string): Promise<string>;

  /**
   * 根据键名设置对应值 且返回旧的值
   *
   * @param {string} key
   * @param {string} value
   * @returns {Promise<string>}
   * @memberof IRedisString
   */
  getset(key: string, value: string): Promise<string>;


  /**
   * 返回其字符串值的长度
   * 
   * 当键 key 不存在时,命令返回 0
   * 
   * 当 key 储存的不是字符串值时,返回一个错误
   * @param {string} key
   * @returns {Promise<number>}
   * @memberof IRedisString
   */
  strlen(key: string): Promise<number>;


  /**
   * 返回追加 value 之后,键 key 的值的长度
   * 
   * 当 key 不存在时 类似于 set key value
   * @param {string} key
   * @param {string} value
   * @returns {Promise<number>}
   * @memberof IRedisString
   */
  append(key: string, value: string): Promise<number>;


  /**
   * 为 key 储存的数字值加上一 并返回加一后的值
   * 
   * 当 key 不存在时,那么它的值会先被初始化为 0 然后加一
   * 
   * 当 key 储存的不是字符串值或不为整数时,将返回一个错误
   * @param {string} key
   * @returns {Promise<number>}
   * @memberof IRedisString
   */
  incr(key: string): Promise<number>;

  /**
   * 为 key 储存的数字值加上 increment 并返回加 increment 后的值
   * 
   * 当 key 不存在时,那么它的值会先被初始化为 0 然后加整数 increment
   * 
   * 当 key 储存的不是字符串值或不为整数时,将返回一个错误
   * @param {string} key
   * @param {number} increment 整数
   * @returns {Promise<number>}
   * @memberof IRedisString
   */
  incrby(key: string, increment: number): Promise<number>;


  /**
   * 为 key 储存的数字值加上 increment 并返回加 increment 后的值
   * 
   * 当 key 不存在时,那么它的值会先被初始化为 0 然后加浮点数 increment
   * 
   * 当 key 储存的不是字符串值时,将返回一个错误
   * @param {string} key
   * @param {number} increment 浮点数
   * @returns {Promise<number>}
   * @memberof IRedisString
   */
  incrbyfloat(key: string, increment: number): Promise<number>;


  /**
   * 为 key 储存的数字值减一 并返回减一后的值
   * 
   * 当 key 不存在时,那么它的值会先被初始化为 0 然后减一
   * 
   * 当 key 储存的不是字符串值或不为整数时,将返回一个错误
   * @param {string} key
   * @returns {Promise<number>}
   * @memberof IRedisString
   */
  decr(key: string): Promise<number>;

  /**
   * 为 key 储存的数字值减上 decrement 并返回减 decrement 后的值
   * 
   * 当 key 不存在时,那么它的值会先被初始化为 0 然后减整数 decrement
   * 
   * 当 key 储存的不是字符串值或不为整数时,将返回一个错误
   * @param {string} key
   * @param {number} decrement 整数
   * @returns {Promise<number>}
   * @memberof IRedisString
   */
  decrby(key: string, decrement: number): Promise<number>;

  /**
   * 同时为多个键设置值 成功返回 OK
   *
   * @param {string} key
   * @param {string} value
   * @param {...any[]} args
   * @returns {Promise<'OK'>}
   * @memberof IRedisString
   */
  mset(key: string, value: string, ...args: any[]): Promise<'OK'>;

  /**
   * 当且仅当所有给定键都不存在时,为所有给定键设置值 成功返回 1
   *
   * @param {string} key
   * @param {string} value
   * @param {...any[]} args
   * @returns {Promise<number>} 0 | 1
   * @memberof IRedisString
   */
  msetnx(key: string, value: string, ...args: any[]): Promise<number>;

  /**
   * 返回给定的一个或多个字符串键的值 对应键值为空在返回数组中的对应位置将返回 null
   *
   * @param {string} key
   * @param {...any[]} args
   * @returns {Promise<string[]>}
   * @memberof IRedisString
   */
  mget(key: string, ...args: any[]): Promise<string[]>;

}
