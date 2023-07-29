import { EntityManager } from '@mikro-orm/mysql';
import { IDomainEvent } from 'apps/mba-ddd-venda-ingresso/src/@core/@shared/domain/domain-event';
import {
  StoredEvent,
  StoredEventId,
} from '../../../domain/entities/stored-event.entity';
import { IStoredEventRepository } from '../../../domain/repositories/stored-event.repository';

export class StoredEventMysqlRepository implements IStoredEventRepository {
  constructor(private entityManager: EntityManager) {}

  allBetween(
    lowEventId: StoredEventId,
    highEventId: StoredEventId,
  ): Promise<StoredEvent[]> {
    return this.entityManager.find(StoredEvent, {
      id: { $gte: lowEventId.value, $lte: highEventId.value },
    });
  }

  async allSince(storedEventId: StoredEventId): Promise<StoredEvent[]> {
    return this.entityManager.find(StoredEvent, {
      id: { $gte: storedEventId.value },
    });
  }

  add(domainEvent: IDomainEvent): StoredEvent {
    const storedEvent = StoredEvent.create(domainEvent);

    this.entityManager.persist(storedEvent);

    return storedEvent;
  }
}
