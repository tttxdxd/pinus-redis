import { IRedisBase } from "./Base";

export interface IRedisList extends IRedisBase {

  /**
   * 将一个或多个值 value 插入到列表 key 的表头
   *
   * 返回列表的长度
   * @param {string} key
   * @param {...string[]} values
   * @returns {Promise<number>}
   * @memberof IRedisList
   */
  lpush(key: string, value: string, ...values: string[]): Promise<number>;

  /**
   * 将值 value 插入到列表 key 的表头，当且仅当 key 存在并且是一个列表
   *
   * 返回列表的长度
   * @param {string} key
   * @param {string} value
   * @returns {Promise<number>}
   * @memberof IRedisList
   */
  lpushx(key: string, value: string): Promise<number>;

  /**
   * 将一个或多个值 value 插入到列表 key 的表尾(最右边)
   *
   * 返回列表的长度
   * @param {string} key
   * @param {...string[]} values
   * @returns {Promise<number>}
   * @memberof IRedisList
   */
  rpush(key: string, value: string, ...values: string[]): Promise<number>;

  /**
   * 将一个或多个值 value 插入到列表 key 的表尾(最右边)
   *
   * 返回列表的长度
   * @param {string} key
   * @param {...string[]} values
   * @returns {Promise<number>}
   * @memberof IRedisList
   */
  rpush(key: string, ...values: string[]): Promise<number>;

  /**
   * 将值 value 插入到列表 key 的表尾(最右边)，当且仅当 key 存在并且是一个列表
   *
   * 返回列表的长度
   * @param {string} key
   * @param {string} value
   * @returns {Promise<number>}
   * @memberof IRedisList
   */
  rpushx(key: string, value: string): Promise<number>;

  /**
   * 移除并返回列表 key 的头元素
   *
   * @param {string} key
   * @returns {Promise<string>}
   * @memberof IRedisList
   */
  lpop(key: string): Promise<string>;

  /**
   * 移除并返回列表 key 的尾元素
   *
   * @param {string} key
   * @returns {Promise<string>}
   * @memberof IRedisList
   */
  rpop(key: string): Promise<string>;

  /**
   * 命令 RPOPLPUSH 在一个原子时间内，执行以下两个动作：
   * 
   * - 将列表 source 中的最后一个元素(尾元素)弹出，并返回给客户端
   * 
   * - 将 source 弹出的元素插入到列表 destination ，作为 destination 列表的的头元素
   *
   * 如果 source 不存在，值 nil 被返回，并且不执行其他动作。
   * 
   * 如果 source 和 destination 相同，则列表中的表尾元素被移动到表头，并返回该元素，可以把这种特殊情况视作列表的旋转(rotation)操作
   * @param {string} source
   * @param {string} destination
   * @returns {Promise<string>}
   * @memberof IRedisList
   */
  rpoplpush(source: string, destination: string): Promise<string>;

  /**
   * 根据参数 count 的值，移除列表中与参数 value 相等的元素
   *
   * count > 0 : 从表头开始向表尾搜索，移除与 value 相等的元素，数量为 count 。
   * 
   * count < 0 : 从表尾开始向表头搜索，移除与 value 相等的元素，数量为 count 的绝对值。
   * 
   * count = 0 : 移除表中所有与 value 相等的值
   * 
   * 返回列表移除元素的个数
   * @param {string} key
   * @param {number} count
   * @param {string} value
   * @returns {Promise<number>} 返回列表移除元素的个数
   * @memberof IRedisList
   */
  lrem(key: string, count: number, value: string): Promise<number>;

  /**
   * 返回列表 key 的长度
   *
   * 如果 key 不存在，则 key 被解释为一个空列表，返回 0
   * @param {string} key
   * @returns {Promise<number>}
   * @memberof IRedisList
   */
  llen(key: string): Promise<number>;

  /**
   * 返回列表 key 中，下标为 index 的元素
   *
   * @param {string} key
   * @param {number} index
   * @returns {Promise<string>}
   * @memberof IRedisList
   */
  lindex(key: string, index: number): Promise<string>;

  /**
   * 将值 value 插入到列表 key 当中，位于值 pivot 之前或之后
   *
   * 返回列表的长度
   * @param {string} key
   * @param {('BEFORE' | 'AFTER')} dir
   * @param {string} pivot
   * @param {string} value
   * @returns {Promise<number>}
   * @memberof IRedisList
   */
  linsert(key: string, dir: 'BEFORE' | 'AFTER', pivot: string, value: string): Promise<number>;

  /**
   * 将列表 key 下标为 index 的元素的值设置为 value
   *
   * @param {string} key
   * @param {number} index
   * @param {string} value
   * @returns {Promise<'OK'>}
   * @memberof IRedisList
   */
  lset(key: string, index: number, value: string): Promise<'OK'>;

  /**
   * 返回列表 key 中指定区间内的元素，区间以偏移量 start 和 stop 指定
   *
   * @param {string} key
   * @param {number} start
   * @param {number} stop
   * @returns {Promise<string[]>}
   * @memberof IRedisList
   */
  lrange(key: string, start: number, stop: number): Promise<string[]>;

  /**
   * 对一个列表进行修剪(trim)，就是说，让列表只保留指定区间内的元素，不在指定区间之内的元素都将被删除
   *
   * @param {string} key
   * @param {number} start
   * @param {number} stop
   * @returns {Promise'OK'>}
   * @memberof IRedisList
   */
  ltrim(key: string, start: number, stop: number): Promise<'OK'>;

  /**
    * BLPOP 是列表的阻塞式(blocking)弹出原语
    * 
    * 它是 LPOP key 命令的阻塞版本，当给定列表内没有任何元素可供弹出的时候，连接将被 BLPOP 命令阻塞，直到等待超时或发现可弹出元素为止
    *
    * 超时参数 timeout 接受一个以秒为单位的数字作为值。超时参数设为 0 表示阻塞时间可以无限期延长
    * @param {string} key
    * @param {(...(string | number)[])} args
    * @returns {Promise<[string, string]>}
    * @memberof IRedisList
    */
  blpop(key: string, timeout: number): Promise<[string, string]>;

  /**
    * BLPOP 是列表的阻塞式(blocking)弹出原语
    * 
    * 它是 LPOP key 命令的阻塞版本，当给定列表内没有任何元素可供弹出的时候，连接将被 BLPOP 命令阻塞，直到等待超时或发现可弹出元素为止
    *
    * 超时参数 timeout 接受一个以秒为单位的数字作为值。超时参数设为 0 表示阻塞时间可以无限期延长
    * @param {string} key
    * @param {(...(string | number)[])} args
    * @returns {Promise<[string, string]>}
    * @memberof IRedisList
    */
  blpop(key: string, key2: string, timeout: number): Promise<[string, string]>;

  /**
   * BLPOP 是列表的阻塞式(blocking)弹出原语
   * 
   * 它是 LPOP key 命令的阻塞版本，当给定列表内没有任何元素可供弹出的时候，连接将被 BLPOP 命令阻塞，直到等待超时或发现可弹出元素为止
   *
   * 超时参数 timeout 接受一个以秒为单位的数字作为值。超时参数设为 0 表示阻塞时间可以无限期延长
   * @param {string} key
   * @param {(...(string | number)[])} args
   * @returns {Promise<[string, string]>}
   * @memberof IRedisList
   */
  blpop(key: string, ...args: (string | number)[]): Promise<[string, string]>;

  /**
   * BRPOP 是列表的阻塞式(blocking)弹出原语
   * 
   * 它是 RPOP key 命令的阻塞版本，当给定列表内没有任何元素可供弹出的时候，连接将被 BRPOP 命令阻塞，直到等待超时或发现可弹出元素为止
   *
   * 超时参数 timeout 接受一个以秒为单位的数字作为值。超时参数设为 0 表示阻塞时间可以无限期延长
   * @param {string} key
   * @param {(...(string | number)[])} args
   * @returns {Promise<[string, string]>}
   * @memberof IRedisList
   */
  brpop(key: string, timeout: number): Promise<[string, string]>;

  /**
   * BRPOP 是列表的阻塞式(blocking)弹出原语
   * 
   * 它是 RPOP key 命令的阻塞版本，当给定列表内没有任何元素可供弹出的时候，连接将被 BRPOP 命令阻塞，直到等待超时或发现可弹出元素为止
   *
   * 超时参数 timeout 接受一个以秒为单位的数字作为值。超时参数设为 0 表示阻塞时间可以无限期延长
   * @param {string} key
   * @param {(...(string | number)[])} args
   * @returns {Promise<[string, string]>}
   * @memberof IRedisList
   */
  brpop(key: string, key2: string, timeout: number): Promise<[string, string]>;

  /**
   * BRPOP 是列表的阻塞式(blocking)弹出原语
   * 
   * 它是 RPOP key 命令的阻塞版本，当给定列表内没有任何元素可供弹出的时候，连接将被 BRPOP 命令阻塞，直到等待超时或发现可弹出元素为止
   *
   * 超时参数 timeout 接受一个以秒为单位的数字作为值。超时参数设为 0 表示阻塞时间可以无限期延长
   * @param {string} key
   * @param {(...(string | number)[])} args
   * @returns {Promise<[string, string]>}
   * @memberof IRedisList
   */
  brpop(key: string, ...args: (string | number)[]): Promise<[string, string]>;

  /**
   * BRPOPLPUSH 是 RPOPLPUSH source destination 的阻塞版本，当给定列表 source 不为空时， BRPOPLPUSH 的表现和 RPOPLPUSH source destination 一样
   *
   * 超时参数 timeout 接受一个以秒为单位的数字作为值。超时参数设为 0 表示阻塞时间可以无限期延长
   * @param {string} source
   * @param {string} destination
   * @param {number} timeout
   * @returns {Promise<string>}
   * @memberof IRedisList
   */
  brpoplpush(source: string, destination: string, timeout: number): Promise<string>;
}