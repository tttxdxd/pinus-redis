/**
 * 
 * author: tttxdxd
 * date: 2020-01-14 10:55:00
 */

'use strict';
import { createClient, RedisClient, ClientOpts } from 'redis';
import { Logger } from 'pinus-logger';

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
  logger: Console | Logger = console;
  client!: RedisClient;
  clientOpts?: ClientOpts;

  constructor(opts?: ClientOpts, logger?: Console | Logger) {
    this.clientOpts = opts;
    this.logger = logger || this.logger;
  }

  start(): Promise<any> {
    this.client = createClient(this.clientOpts);

    this.client.on('ready', this.onready.bind(this));
    this.client.on('connect', this.onconnect.bind(this));
    this.client.on('error', this.onerror.bind(this));
    this.client.on('warning', this.onwarning.bind(this));
    this.client.on('reconnecting', this.onreconnecting.bind(this));
    this.client.on('end', this.onend.bind(this));

    return new Promise(resolve => {
      this.client.on('connect', function () {
        resolve();
      });
    });
  }

  stop(flush?: boolean) {
    this.client.end(flush);
  }

  onready() {
    this.logger.log('redis ready.');
  }

  onconnect() {
    this.logger.log('redis connect.');
  }

  onreconnecting(delay, attempt) {
    this.logger.log('redis reconnecting.');
  }

  onerror(err: Error) {
    this.logger.log('redis error.');
  }

  onwarning() {
    this.logger.log('redis warning.');
  }

  onend() {
    this.logger.log('redis end.');
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
    return promisify(this.client, this.client.set, key, value, ...args);
  }

  /**
   * 根据键名获取对应值
   *
   * @param {string} key
   * @returns {Promise<any>}
   * @memberof RedisProxy
   */
  get(key: string): Promise<any> {
    return promisify(this.client, this.client.get, key);
  }

  /**
   * 删除 键值对 可传入多个键名 返回成功删除键值对的个数
   *
   * @param {...string[]} keys
   * @returns {Promise<any>}
   * @memberof RedisProxy
   */
  del(...keys: string[]): Promise<any> {
    return promisify(this.client, this.client.del, ...keys);
  }

  getset(key: string, value: string): Promise<any> {
    return promisify(this.client, this.client.getset, key, value);
  }

  strlen(key: string): Promise<number> {
    return promisify(this.client, this.client.strlen, key);
  }
}

function promisify(client: RedisClient, callback: Function, ...args: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!client) {
      reject(new Error('client is undefined'));
      return;
    }

    callback.call(client, ...args, (error: Error, reply: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(reply);
      }
    });
  });
}