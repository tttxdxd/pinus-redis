import { Multi } from "redis";

declare module "redis" {
  interface Multi {
    execAsync(): Promise<any[]>;
  }
}

Multi.prototype.execAsync = function (): Promise<any[]> {
  return new Promise((resolve, reject) => {
    this.exec((error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    })
  });
}

export interface IRedisPipeline {

  /**
   * 链式调用 必须以 .execAsync() 结束
   *
   * @returns {Multi}
   * @memberof IRedisPipeline
   */
  multi(): Multi;
}