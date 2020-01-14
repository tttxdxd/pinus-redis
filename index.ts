import { Application, IComponent } from 'pinus';
import { ClientOpts } from 'redis';

import { RedisProxy } from './lib/redis';

export * from './lib/redis';

export class RedisComponent implements IComponent {
  name: string = '__redis__';
  redis!: RedisProxy;

  constructor(app: Application, opts?: ClientOpts) {
    this.redis = new RedisProxy(opts);

    app.set('redis', this.redis, true);
  }

  start(cb: () => void): void {
    this.redis.init();

    process.nextTick(cb);
  }
}