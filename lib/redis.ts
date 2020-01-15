/**
 * 
 * author: tttxdxd
 * date: 2020-01-14 10:55:00
 */

'use strict';
import { createClient, RedisClient, ClientOpts } from 'redis';
import { Logger } from 'pinus-logger';

import { IRedisString, IRedisZset } from './interface';

export class RedisProxy implements IRedisString, IRedisZset {
  logger: Console | Logger = console;
  client!: RedisClient;
  clientOpts?: ClientOpts;

  string: IRedisString = this;
  zset: IRedisZset = this;

  constructor(opts?: ClientOpts, logger?: Console | Logger) {
    this.clientOpts = opts;
    this.logger = logger || this.logger;

    this.client = createClient(this.clientOpts);

    this.client.on('ready', this.onready.bind(this));
    this.client.on('connect', this.onconnect.bind(this));
    this.client.on('error', this.onerror.bind(this));
    this.client.on('warning', this.onwarning.bind(this));
    this.client.on('reconnecting', this.onreconnecting.bind(this));
    this.client.on('end', this.onend.bind(this));
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

  onreconnecting({ delay, attempt, error }) {
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

  //#region base

  exists(...keys: string[]): Promise<number> {
    return promisify(this.client, this.client.exists, ...keys);
  }

  del(...keys: string[]): Promise<number> {
    return promisify(this.client, this.client.del, ...keys);
  }

  //#endregion

  //#region 字符串

  set(key: string, value: string, ...args: any[]): Promise<any> {
    return promisify(this.client, this.client.set, key, value, ...args);
  }

  get(key: string): Promise<string> {
    return promisify(this.client, this.client.get, key);
  }

  getset(key: string, value: string): Promise<string> {
    return promisify(this.client, this.client.getset, key, value);
  }

  strlen(key: string): Promise<number> {
    return promisify(this.client, this.client.strlen, key);
  }

  append(key: string, value: string): Promise<number> {
    return promisify(this.client, this.client.append, key, value);
  }

  incr(key: string): Promise<number> {
    return promisify(this.client, this.client.incr, key);
  }

  incrby(key: string, increment: number): Promise<number> {
    return promisify(this.client, this.client.incrby, key, increment);
  }

  incrbyfloat(key: string, increment: number): Promise<number> {
    return promisify(this.client, this.client.incrbyfloat, key, increment);
  }

  decr(key: string): Promise<number> {
    return promisify(this.client, this.client.decr, key);
  }

  decrby(key: string, decrement: number): Promise<number> {
    return promisify(this.client, this.client.decrby, key, decrement);
  }

  mset(key: string, value: string, ...args: any[]): Promise<any> {
    return promisify(this.client, this.client.mset, key, value, ...args);
  }

  msetnx(key: string, value: string, ...args: any[]): Promise<any> {
    return promisify(this.client, this.client.msetnx, key, value, ...args);
  }

  mget(key: string, ...args: any[]): Promise<string[]> {
    return promisify(this.client, this.client.mget, key, ...args);
  }

  //#endregion

  //#region 哈希表

  //#endregion

  //#region 列表

  //#endregion

  //#region 集合

  //#endregion

  //#region 有序集合
  zadd(key: string, ...args: (string | number)[]): Promise<number> {
    return promisify(this.client, this.client.zadd, key, ...args);
  }

  zscore(key: string, member: string): Promise<string> {
    return promisify(this.client, this.client.zscore, key, member);
  }

  zcard(key: string): Promise<number> {
    return promisify(this.client, this.client.zcard, key);
  }

  zcount(key: string, min: number | string, max: number | string): Promise<number> {
    return promisify(this.client, this.client.zcount, key, min, max);
  }

  zrange(key: string, ...args: any[]): Promise<string[]> {
    return promisify(this.client, this.client.zrange, key, ...args);
  }

  zrevrange(key: string, ...args: any[]): Promise<string[]> {
    return promisify(this.client, this.client.zrevrange, key, ...args);
  }
  //#endregion
}

function promisify(client: RedisClient, callback: Function, ...args: any[]): Promise<any> {
  if (!client) {
    return Promise.reject(new Error('client is undefined'));
  }

  return new Promise((resolve, reject) => {
    callback.call(client, ...args, (error: Error, reply: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(reply);
      }
    });
  });
}