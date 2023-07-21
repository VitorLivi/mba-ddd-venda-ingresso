import { Collection } from '@mikro-orm/core';

export interface ICollection<T extends object> {
  getItems(): Iterable<T>;
  add(item: T, ...items: T[]): void;
  remove(item: T, ...items: T[]): void;
  find(predicate: (item: T) => boolean): T | undefined;
  forEach(callback: (value: T, index: number) => void): void;
  removeAll(): void;
  count(): number;
  [Symbol.iterator](): Iterator<T>;
}

export type AnyCollection<T extends object> = Collection<T>;

export class MyCollectionFactory {
  static create<T extends object>(ref): ICollection<T> {
    const collection = new Collection<T>(ref);
    collection['initialized'] = false;
    return MyCollectionFactory.createProxy(collection);
  }

  static createFrom<T extends object>(target: Collection<any>): ICollection<T> {
    return MyCollectionFactory.createProxy(target);
  }

  private static createProxy<T extends object>(
    target: Collection<T>,
  ): ICollection<T> {
    // @ts-expect-error - TODO: comment this
    return new Proxy(target, {
      get: (target, prop, receiver) => {
        if (prop === 'find') {
          return (predicate: (item: T) => boolean): T | undefined => {
            return target.getItems().find(predicate);
          };
        }

        if (prop === 'forEach') {
          return (callback: (value: T, index: number) => void): void => {
            return target.getItems().forEach(callback);
          };
        }

        if (prop === 'count') {
          return () => {
            return target.isInitialized() ? target.getItems().length : 0;
          };
        }

        return Reflect.get(target, prop, receiver);
      },
    });
  }
}
