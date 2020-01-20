/**
 * 
 * author: tttxdxd
 * date: 2020-01-14 10:55:00
 */

'use strict';
import { createClient, RedisClient, ClientOpts, Multi } from 'redis';
import { Logger } from 'log4js';

import { IRedisString, IRedisZset, IHyperLogLog, IRedisList, IRedisSet, IRedisCommand } from './interface';
import { IRedisHash } from './interface/Hash';
import { IRedisBitmap, FieldType, FieldOffset, OverflowType } from './interface/Bitmap';
import "./interface/Pipeline";

export class RedisProxy implements IRedisCommand {
  logger: Console | Logger = console;
  client!: RedisClient;
  clientOpts?: ClientOpts;

  String: IRedisString = this;
  List: IRedisList = this;
  Set: IRedisSet = this;
  Hash: IRedisHash = this;
  Zset: IRedisZset = this;
  Bitmap: IRedisBitmap = this;
  HyperLogLog: IHyperLogLog = this;

  constructor(opts?: ClientOpts, logger?: Console | Logger) {
    this.clientOpts = opts;
    this.logger = logger || this.logger;

    this.start();
    // this.client.on("monitor", this.onmonitor.bind(this));
    // this.client.monitor(function (err, res) {
    //   console.log("Entering monitoring mode.");
    // });

  }

  start() {
    if (this.client) {
      this.logger.warn('redis client has start');
      return;
    }

    this.client = createClient(this.clientOpts);

    this.client.once('ready', this.onready.bind(this));
    this.client.on('connect', this.onconnect.bind(this));
    this.client.on('error', this.onerror.bind(this));
    this.client.on('warning', this.onwarning.bind(this));
    this.client.on('reconnecting', this.onreconnecting.bind(this));
  }

  stop(): Promise<'OK'> {
    this.client.once('end', this.onend.bind(this));

    return promisify(this.client, this.client.quit);
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
    this.logger.error('redis error. error =', err);
  }

  onwarning() {
    this.logger.log('redis warning.');
  }

  onend() {
    this.logger.log('redis end.');
  }

  onmonitor(time, args, raw_reply) {
    this.logger.log(time + ": " + args); // 1458910076.446514:['set', 'foo', 'bar']
  }


  //#region base

  ping(...args: string[]): Promise<'PONG'> {
    return promisify(this.client, this.client.ping, ...args);
  }

  exists(...keys: string[]): Promise<number> {
    return promisify(this.client, this.client.exists, ...keys);
  }

  del(...keys: string[]): Promise<number> {
    return promisify(this.client, this.client.del, ...keys);
  }

  expire(key: string, seconds: number): Promise<number> {
    return promisify(this.client, this.client.expire, key, seconds);
  }

  expireat(key: string, timestamp: number): Promise<number> {
    return promisify(this.client, this.client.expireat, key, timestamp);
  }

  ttl(key: string): Promise<number> {
    return promisify(this.client, this.client.ttl, key);
  }

  persist(key: string): Promise<number> {
    return promisify(this.client, this.client.persist, key);
  }

  pexpire(key: string, milliseconds: number): Promise<number> {
    return promisify(this.client, this.client.pexpire, key, milliseconds);
  }

  pexpireat(key: string, millisecondsTimestamp: number): Promise<number> {
    return promisify(this.client, this.client.pexpireat, key, millisecondsTimestamp);
  }

  pttl(key: string): Promise<number> {
    return promisify(this.client, this.client.pttl, key);
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
    return promisify(this.client, this.client.incrbyfloat, key, increment).then(toNumber);
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

  hset(key: string, field: string, value: string): Promise<number> {
    return promisify(this.client, this.client.hset, key, field, value);
  }

  hsetnx(key: string, field: string, value: string): Promise<number> {
    return promisify(this.client, this.client.hsetnx, key, field, value);
  }

  hget(key: string, field: string): Promise<string | null> {
    return promisify(this.client, this.client.hget, key, field);
  }

  hexists(key: string, field: string): Promise<number> {
    return promisify(this.client, this.client.hexists, key, field);
  }

  hdel(key: string, field: string, ...fields: string[]): Promise<number> {
    return promisify(this.client, this.client.hdel, key, field, ...fields);
  }

  hlen(key: string): Promise<number> {
    return promisify(this.client, this.client.hlen, key);
  }

  hstrlen(key: string, field: string): Promise<number> {
    return promisify(this.client, this.client.hstrlen, key, field);
  }

  hincrby(key: string, field: string, increment: number): Promise<number> {
    return promisify(this.client, this.client.hincrby, key, field, increment);
  }

  hincrbyfloat(key: string, field: string, increment: number): Promise<number> {
    return promisify(this.client, this.client.hincrbyfloat, key, field, increment).then(toNumber);
  }

  hmset(key: string, ...args: any[]): Promise<'OK'> {
    return promisify(this.client, this.client.hmset, key, ...args);
  }

  hmget(key: string, field: string, ...fields: string[]): Promise<string[]> {
    return promisify(this.client, this.client.hmget, key, field, ...fields);
  }

  hkeys(key: string): Promise<string[]> {
    return promisify(this.client, this.client.hkeys, key);
  }

  hvals(key: string): Promise<string[]> {
    return promisify(this.client, this.client.hvals, key);
  }

  hgetall(key: string): Promise<{ [key: string]: string }> {
    return promisify(this.client, this.client.hgetall, key);
  }

  //#endregion


  //#region 列表

  lpush(key: string, ...values: string[]): Promise<number> {
    return promisify(this.client, this.client.lpush, key, ...values);
  }

  lpushx(key: string, value: string): Promise<number> {
    return promisify(this.client, this.client.lpushx, key, value);
  }

  rpush(key: string, ...values: string[]): Promise<number> {
    return promisify(this.client, this.client.rpush, key, ...values);
  }

  rpushx(key: string, value: string): Promise<number> {
    return promisify(this.client, this.client.rpushx, key, value);
  }

  lpop(key: string): Promise<string> {
    return promisify(this.client, this.client.lpop, key);
  }

  rpop(key: string): Promise<string> {
    return promisify(this.client, this.client.rpop, key);
  }

  lrem(key: string, count: number, value: string): Promise<number> {
    return promisify(this.client, this.client.lrem, key, count, value);
  }

  llen(key: string): Promise<number> {
    return promisify(this.client, this.client.llen, key);
  }

  lindex(key: string, index: number): Promise<string> {
    return promisify(this.client, this.client.lindex, key, index);
  }

  linsert(key: string, dir: 'BEFORE' | 'AFTER', pivot: string, value: string): Promise<number> {
    return promisify(this.client, this.client.linsert, key, dir, pivot, value);
  }

  lset(key: string, index: number, value: string): Promise<'OK'> {
    return promisify(this.client, this.client.lset, key, index, value);
  }

  lrange(key: string, start: number, stop: number): Promise<string[]> {
    return promisify(this.client, this.client.lrange, key, start, stop);
  }

  ltrim(key: string, start: number, stop: number): Promise<'OK'> {
    return promisify(this.client, this.client.ltrim, key, start, stop);
  }

  blpop(key: string, ...args: any[]): Promise<[string, string]> {
    return promisify(this.client, this.client.blpop, key, ...args);
  }

  brpop(key: string, ...args: any[]): Promise<[string, string]> {
    return promisify(this.client, this.client.brpop, key, ...args);
  }

  rpoplpush(source: string, destination: string): Promise<string> {
    return promisify(this.client, this.client.rpoplpush, source, destination);
  }

  brpoplpush(source: string, destination: string, timeout: number): Promise<string> {
    return promisify(this.client, this.client.brpoplpush, source, destination, timeout);
  }

  //#endregion


  //#region 集合
  sadd(key: string, ...members: string[]): Promise<number> {
    return promisify(this.client, this.client.sadd, key, ...members);
  }

  sismember(key: string, member: string): Promise<number> {
    return promisify(this.client, this.client.sismember, key, member);
  }

  spop(key: string): Promise<string> {
    return promisify(this.client, this.client.spop, key);
  }

  srandmember(...args: any[]): Promise<any> {
    return promisify(this.client, this.client.srandmember, ...args);
  }

  srem(key: string, ...members: string[]): Promise<number> {
    return promisify(this.client, this.client.srem, key, ...members);
  }

  smove(source: string, destination: string, member: string): Promise<number> {
    return promisify(this.client, this.client.smove, source, destination, member);
  }

  scard(key: string): Promise<number> {
    return promisify(this.client, this.client.scard, key);
  }

  smembers(key: string): Promise<string[]> {
    return promisify(this.client, this.client.smembers, key);
  }

  sinter(key: string, ...keys: string[]): Promise<string[]> {
    return promisify(this.client, this.client.sinter, key, ...keys);
  }

  sinterstore(destination: string, ...keys: string[]): Promise<number> {
    return promisify(this.client, this.client.sinterstore, destination, ...keys);
  }

  sunion(key: string, ...keys: string[]): Promise<string[]> {
    return promisify(this.client, this.client.sunion, key, ...keys);
  }

  sunionstore(destination: string, ...keys: string[]): Promise<number> {
    return promisify(this.client, this.client.sunionstore, destination, ...keys);
  }

  sdiff(key: string, ...keys: string[]): Promise<string[]> {
    return promisify(this.client, this.client.sdiff, key, ...keys);
  }

  sdiffstore(destination: string, ...keys: string[]): Promise<number> {
    return promisify(this.client, this.client.sdiffstore, destination, ...keys);
  }

  //#endregion


  //#region 有序集合
  zadd(key: string, ...args: (string | number)[]): Promise<number> {
    if (0 !== args.length % 2) {
      throw new Error(`zadd arguments format is error, args = ${args}`);
    }
    for (let i = 0; i < args.length; i += 2) {
      [args[i], args[i + 1]] = [args[i + 1], args[i]];
    }

    return promisify(this.client, this.client.zadd, key, ...args);
  }

  zscore(key: string, member: string): Promise<number> {
    return promisify(this.client, this.client.zscore, key, member).then(toNumber);
  }

  zincrby(key: string, member: string, increment: number): Promise<number> {
    return promisify(this.client, this.client.zincrby, key, increment, member).then(toNumber);
  }

  zcard(key: string): Promise<number> {
    return promisify(this.client, this.client.zcard, key);
  }

  zcount(key: string, min: number | string, max: number | string): Promise<number> {
    return promisify(this.client, this.client.zcount, key, min, max);
  }

  zrange(key: string, start: number, stop: number, ...args: any[]): Promise<(string | number)[]> {
    return promisify(this.client, this.client.zrange, key, start, stop, ...args).then((list: (string | number)[]) => {
      if (args.length > 0 && list.length > 1) {
        for (let i = 1; i < list.length; i++) {
          if (1 === i % 2) {
            list[i] = Number(list[i]);
          }
        }
      }
      return list;
    });
  }

  zrevrange(key: string, start: number, stop: number, ...args: any[]): Promise<(string | number)[]> {
    return promisify(this.client, this.client.zrevrange, key, start, stop, ...args).then((list: (string | number)[]) => {
      if (args.length > 0 && list.length > 1) {
        for (let i = 1; i < list.length; i++) {
          if (1 === i % 2) {
            list[i] = Number(list[i]);
          }
        }
      }
      return list;
    });
  }

  zrank(key: string, member: string): Promise<number | null> {
    return promisify(this.client, this.client.zrank, key, member);
  }

  zrevrank(key: string, member: string): Promise<number | null> {
    return promisify(this.client, this.client.zrevrank, key, member);
  }

  zrem(key: string, member: string, ...members: string[]): Promise<number> {
    return promisify(this.client, this.client.zrem, key, member, ...members);
  }

  //#endregion


  //#region 位图
  setbit(key: string, offset: number, value: number): Promise<number> {
    return promisify(this.client, this.client.setbit, key, offset, value);
  }

  getbit(key: string, offset: number): Promise<number> {
    return promisify(this.client, this.client.getbit, key, offset);
  }

  bitcount(key: string): Promise<number> {
    return promisify(this.client, this.client.bitcount, key);
  }

  bitpos(key: string, bit: number, ...args: number[]): Promise<number> {
    return promisify(this.client, this.client.bitpos, key, bit, ...args);
  }

  bitop(operation: string, destkey: string, ...args: string[]): Promise<number> {
    return promisify(this.client, this.client.bitop, operation, destkey, args);
  }

  bitfield(key: string, ...args: (string | number)[]): Promise<[number, number]> {
    return promisify(this.client, this.client.bitfield, key, ...args);
  }

  cmdSet(type: FieldType, offset: FieldOffset, value: string): any[] {
    return ['SET', type, offset, value];
  }

  cmdGet(type: FieldType, offset: FieldOffset): any[] {
    return ['GET', type, offset];
  }

  cmdIncrby(type: FieldType, offset: FieldOffset, increment: number): any[] {
    return ['INCRBY', type, offset, increment];
  }

  cmdIncrbyWithOverflow(oftype: OverflowType, type: FieldType, offset: FieldOffset, increment: number): any[] {
    return ['OVERFLOW', oftype, 'INCRBY', type, offset, increment];
  }
  //#endregion


  //#region HyperLogLog
  pfadd(key: string, field: string, ...fields: string[]): Promise<number> {
    return promisify(this.client, this.client.pfadd, key, field, ...fields);
  }

  pfcount(key: string): Promise<number> {
    return promisify(this.client, this.client.pfcount, key);
  }

  pfmerge(destkey: string, key: string, ...keys: string[]): Promise<'OK'> {
    return promisify(this.client, this.client.pfmerge, destkey, key, ...keys);
  }
  //#endregion


  //#region channel

  publish(channel: string, value: string): Promise<number> {
    return promisify(this.client, this.client.publish, channel, value);
  }

  subscribe(channel: string): Promise<string> {
    return promisify(this.client, this.client.subscribe, channel);
  }

  //#endregion


  //#region pipeline

  multi(): Multi {
    return this.client.multi();
  }

  //#endregion
}

function toNumber(num: string): number {
  return Number(num);
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