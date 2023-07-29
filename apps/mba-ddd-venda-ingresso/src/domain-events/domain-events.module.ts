import { EntityManager } from '@mikro-orm/mysql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { IDomainEvent } from '../@core/@shared/domain/domain-event';
import { DomainEventManager } from '../@core/@shared/domain/domain-event-manager';
import { StoredEventMysqlRepository } from '../@core/store-events/infra/db/repositories/stored-event-mysql.repository';
import { StoredEventSchema } from '../@core/store-events/infra/db/schemas';
import { IntegrationEventsPublisher } from './integration-events-publisher';

@Global()
@Module({
  imports: [MikroOrmModule.forFeature([StoredEventSchema])],
  providers: [
    DomainEventManager,
    IntegrationEventsPublisher,
    {
      provide: 'IStoredEventRepository',
      useFactory: (em: EntityManager) => new StoredEventMysqlRepository(em),
      inject: [EntityManager],
    },
  ],
  exports: [DomainEventManager],
})
export class DomainEventsModule implements OnModuleInit {
  constructor(
    private readonly domainEventManager: DomainEventManager,
    private moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.domainEventManager.register('*', async (event: IDomainEvent) => {
      const repo = await this.moduleRef.resolve('IStoredEventRepository');
      await repo.add(event);
    });
  }
}
