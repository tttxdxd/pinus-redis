import { ClientOpts } from 'redis';
import { Application, IComponent } from 'pinus';
import { getLogger, Logger } from 'pinus-logger';

import { RedisProxy } from './lib/redis';

const logger: Logger = getLogger('redis', 'pinus-redis');

export * from './lib/redis';

export class RedisComponent implements IComponent {
  name: string = '__redis__';
  redis!: RedisProxy;

  constructor(app: Application, opts?: ClientOpts) {
    this.redis = new RedisProxy(opts, logger);

    app.set('redis', this.redis, true);
  }

  start(cb: () => void): void {
    process.nextTick(cb);
  }
}