/**
 * 
 * author: tttxdxd
 * date: 2020-01-14 10:55:00
 */

'use strict';
import { createClient, RedisClient, ClientOpts } from 'redis';
import { getLogger, Logger } from 'pinus-logger';

const logger: Logger = getLogger('redis', 'pinus-redis');

// export enum SetMode {
//   EX = 'EX',                  // 设置指定的终止时间，以秒为单位。
//   PX = 'PX',                  // 设置指定的终止时间，以毫秒为单位。
//   NX = 'NX',                  // 仅设置不存在的密钥。
//   XX = 'XX',                  // 仅设置已存在的密钥。
//   KEEPTTL = 'KEEPTTL'         // 保留与钥匙关联的生存时间。 redis >= 6.0：添加了该KEEPTTL选项。
// }
export type SetMode = 'EX' | 'PX' | 'NX' | 'XX' | 'KEEPTTL';

// export enum SetFlag {
//   WRITE = 'write',            // 命令可能会导致修改
//   DENYOON = 'denyoom'         // 如果当前是OOM，则拒绝命令
// }

export type SetFlag = 'write' | 'denyoom';

export class RedisProxy {
  client!: RedisClient;
  clientOpts?: ClientOpts;
  isOpen: boolean = false;

  constructor(opts?: ClientOpts) {
    this.clientOpts = opts;
  }

  init(): Promise<any> {
    this.client = createClient(this.clientOpts);

    this.client.on('ready', this.onready);
    this.client.on('connect', this.onconnect);
    this.client.on('error', this.onerror);
    this.client.on('warning', this.onwarning);
    this.client.on('reconnecting', this.onreconnecting);
    this.client.on('end', this.onend);

    return new Promise(resolve => {
      this.client.on('connect', function () {
        resolve();
      });
    });
  }

  onready() {
    logger.info('redis ready');
  }

  onconnect() {
    logger.info('redis connect');
    this.isOpen = true;
  }

  onreconnecting(delay, attempt) {
    logger.info('redis reconnecting');
  }

  onerror(err: Error) {
    logger.info('redis error');
  }

  onwarning() {
    logger.info('redis warning');
  }

  onend() {
    logger.info('redis end');
  }

  set(key: string, value: string): Promise<any>;
  set(key: string, value: string, flag: SetFlag): Promise<any>;
  set(key: string, value: string, mode: SetMode): Promise<any>;
  set(key: string, value: string, mode: SetMode, duration: number): Promise<any>;
  set(key: string, value: string, mode: SetMode, duration: number, flag: SetFlag): Promise<any>;

  /**
   * 根据键名设置对应值 可传入设置模式 留存时间等参数 成功返回 OK
   *
   * @param {string} key
   * @param {string} value
   * @param {...any[]} args
   * @returns {Promise<any>}
   * @memberof RedisProxy
   */
  set(key: string, value: string, ...args: any[]): Promise<any> {
    return promisify(this.client.set.bind(this.client), key, value, ...args);
  }

  /**
   * 根据键名获取对应值
   *
   * @param {string} key
   * @returns {Promise<any>}
   * @memberof RedisProxy
   */
  get(key: string): Promise<any> {
    return promisify(this.client.get.bind(this.client), key);
  }

  /**
   * 删除 键值对 可传入多个键名 返回成功删除键值对的个数
   *
   * @param {...string[]} keys
   * @returns {Promise<any>}
   * @memberof RedisProxy
   */
  del(...keys: string[]): Promise<any> {
    return promisify(this.client.del.bind(this.client), ...keys);
  }
}

function promisify(callback: Function, ...args: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    callback(...args, (error: Error, reply: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(reply);
      }
    });
  });
}