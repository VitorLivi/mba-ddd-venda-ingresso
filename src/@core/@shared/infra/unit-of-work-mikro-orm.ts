import { EntityManager } from '@mikro-orm/mysql';
import { IUnitOfWork } from '../application/unit-of-work.interface';

export class UnitOfWorkMikroOrm implements IUnitOfWork {
  constructor(private readonly em: EntityManager) { }

  async beginTransaction(): Promise<void> {
    return await this.em.begin();
  }
  completeTransaction(): Promise<void> {
    return this.em.commit();
  }
  rollbackTransaction(): Promise<void> {
    return this.em.rollback();
  }

  runTransaction<T>(callback: () => Promise<T>): Promise<T> {
    return this.em.transactional(callback);
  }

  async commit(): Promise<void> {
    return await this.em.flush();
  }

  async rollback(): Promise<void> {
    this.em.clear();
  }
}
