import { IRedisBase } from "./Base";

type Operation = 'AND' | 'OR' | 'NOT' | 'XOR';

export type FieldType = 'i4' | 'i8' | 'i16' | 'i32' | 'i64' | 'u4' | 'u8' | 'u16' | 'u32';
export type FieldOffset = number | string;

export type OverflowType = 'WRAP' | 'SAT' | 'FAIL';

type SubCommandSet = (type: FieldType, offset: FieldOffset, value: string) => any[];

type SubCommandGet = (type: FieldType, offset: FieldOffset) => any[];

type SubCommandIncrby = (type: FieldType, offset: FieldOffset, increment: number) => any[];

type SubCommandOverflow = (oftype: OverflowType, type: FieldType, offset: FieldOffset, increment: number) => any[];

export interface IRedisBitmap extends IRedisBase {

  /**
   * 对 key 所储存的字符串值，设置或清除指定偏移量上的位(bit)
   * 
   * 当 key 不存在时，自动生成一个新的字符串值
   * 
   * 字符串会进行伸展(grown)以确保它可以将 value 保存在指定的偏移量上。当字符串值进行伸展时，空白位置以 0 填充
   * @param {string} key
   * @param {number} offset offset 参数必须大于或等于 0 ，小于 2^32 (bit 映射被限制在 512 MB 之内)
   * @param {string} value 0 | 1 
   * @returns {Promise<number>} 0 | 1 指定偏移量原来储存的位
   * @memberof IRedisBitmap
   */
  setbit(key: string, offset: number, value: 0 | 1): Promise<number>;

  /**
   * 对 key 所储存的字符串值，获取指定偏移量上的位(bit)
   *
   * 当 offset 比字符串值的长度大，或者 key 不存在时，返回 0
   * @param {string} key
   * @param {number} offset
   * @returns {Promise<number>} 0 | 1
   * @memberof IRedisBitmap
   */
  getbit(key: string, offset: number): Promise<number>;

  /**
   * 计算给定字符串中，被设置为 1 的比特位的数量
   *
   * 一般情况下，给定的整个字符串都会被进行计数，通过指定额外的 start 或 end 参数，可以让计数只在特定的位上进行
   * 
   * 不存在的 key 被当成是空字符串来处理，因此对一个不存在的 key 进行 BITCOUNT 操作，结果为 0
   * @param {string} key
   * @returns {Promise<number>}
   * @memberof IRedisBitmap
   */
  bitcount(key: string): Promise<number>;

  /**
   * 返回位图中第一个值为 bit 的二进制位的位置
   *
   * 在默认情况下， 命令将检测整个位图， 但用户也可以通过可选的 start 参数和 end 参数指定要检测的范围
   * @param {string} key
   * @param {number} bit
   * @param {number} start
   * @param {number} end
   * @returns {Promise<number>}
   * @memberof IRedisBitmap
   */
  bitpos(key: string, bit: number, start: number, end: number): Promise<number>;

  /**
   * 返回位图中第一个值为 bit 的二进制位的位置
   *
   * 在默认情况下， 命令将检测整个位图， 但用户也可以通过可选的 start 参数和 end 参数指定要检测的范围
   * @param {string} key
   * @param {number} bit
   * @param {number} start
   * @returns {Promise<number>}
   * @memberof IRedisBitmap
   */
  bitpos(key: string, bit: number, start: number): Promise<number>;

  /**
   * 返回位图中第一个值为 bit 的二进制位的位置
   *
   * 在默认情况下， 命令将检测整个位图， 但用户也可以通过可选的 start 参数和 end 参数指定要检测的范围
   * @param {string} key
   * @param {number} bit 0 | 1
   * @returns {Promise<number>}
   * @memberof IRedisBitmap
   */
  bitpos(key: string, bit: 0 | 1): Promise<number>;

  /**
   * 对一个或多个保存二进制位的字符串 key 进行位元操作，并将结果保存到 destkey 上
   *
   * 返回 保存到 destkey 的字符串的长度，和输入 key 中最长的字符串长度相等
   * @param {string} operation
   * @param {string} destkey
   * @param {...string[]} args
   * @returns {Promise<number>} 保存到 destkey 的字符串的长度，和输入 key 中最长的字符串长度相等
   * @memberof IRedisBitmap
   */
  bitop(operation: Operation, destkey: string, ...args: string[]): Promise<number>;


  bitfield(key: string, command: 'SET' | 'GET' | 'INCRBY' | 'OVERFLOW', type: FieldType, offset: FieldOffset, ...args: (string | number)[]): Promise<[number, number]>;

  /**
   * 将一个 Redis 字符串看作是一个由二进制位组成的数组， 并对这个数组中储存的长度不同的整数进行访问 （被储存的整数无需进行对齐）
   *
   * 可以在一次调用中同时对多个位范围进行操作： 它接受一系列待执行的操作作为参数， 并返回一个数组作为回复， 数组中的每个元素就是对应操作的执行结果
   * 
   * - GET 返回指定的二进制位范围
   * - SET 对指定的二进制位范围进行设置，并返回它的旧值
   * - INCRBY 对指定的二进制位范围执行加法操作，并返回它的 ~~旧值~~ **新值**
   * - OVERFLOW 无返回值
   * @param {string} key
   * @param {(...(string | number)[])} args
   * @returns {Promise<[number, number]>}
   * @memberof IRedisBitmap
   */
  bitfield(key: string, ...args: (string | number)[]): Promise<[number, number]>;

  cmdGet: SubCommandGet;
  cmdSet: SubCommandSet;
  cmdIncrby: SubCommandIncrby;

  /**
   * 需要注意的是， OVERFLOW 子命令只会对紧随着它之后被执行的 INCRBY 命令产生效果， 这一效果将一直持续到与它一同被执行的下一个 OVERFLOW 命令为止。在默认情况下， INCRBY 命令使用 WRAP 方式来处理溢出计算
   *
   * - WRAP ： 使用回绕（wrap around）方法处理有符号整数和无符号整数的溢出情况。 对于无符号整数来说， 回绕就像使用数值本身与能够被储存的最大无符号整数执行取模计算， 这也是 C 语言的标准行为。对于有符号整数来说， 上溢将导致数字重新从最小的负数开始计算， 而下溢将导致数字重新从最大的正数开始计算。比如说， 如果我们对一个值为 127 的 i8 整数执行加一操作， 那么将得到结果 -128 。
   *
   * - SAT ： 使用饱和计算（saturation arithmetic）方法处理溢出， 也即是说， 下溢计算的结果为最小的整数值， 而上溢计算的结果为最大的整数值。举个例子， 如果我们对一个值为 120 的 i8 整数执行加 10 计算， 那么命令的结果将为 i8 类型所能储存的最大整数值 127 。与此相反， 如果一个针对 i8 值的计算造成了下溢， 那么这个 i8 值将被设置为 -127
   *
   * - FAIL ： 在这一模式下， 命令将拒绝执行那些会导致上溢或者下溢情况出现的计算， 并向用户返回空值表示计算未被执行
   */
  cmdIncrbyWithOverflow: SubCommandOverflow;
}