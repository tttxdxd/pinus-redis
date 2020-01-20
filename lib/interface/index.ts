import { IRedisString } from './String';
import { IRedisList } from './List';
import { IRedisHash } from './Hash';
import { IRedisSet } from './Set';
import { IRedisZset } from './Zset';
import { IRedisBitmap } from './Bitmap';
import { IHyperLogLog } from './HyperLogLog';
import { IRedisPipeline } from './Pipeline';

export * from './String';
export * from './List';
export * from './Hash';
export * from './Set';
export * from './Zset';
export * from './Bitmap';
export * from './HyperLogLog';
export * from './Pipeline';

export interface IRedisCommand extends IRedisString, IRedisList, IRedisHash, IRedisSet, IRedisZset, IRedisBitmap, IHyperLogLog, IRedisPipeline {

}