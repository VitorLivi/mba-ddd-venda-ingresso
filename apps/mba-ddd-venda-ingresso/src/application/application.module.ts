import { Module } from '@nestjs/common';
import { DomainEventManager } from '../@core/@shared/domain/domain-event-manager';
import { ApplicationService } from '../@core/@shared/application/application.service';
import { IUnitOfWork } from '../@core/@shared/application/unit-of-work.interface';

@Module({
  providers: [
    {
      provide: ApplicationService,
      useFactory: (
        uow: IUnitOfWork,
        domainEventManager: DomainEventManager,
      ) => {
        return new ApplicationService(uow, domainEventManager);
      },
      inject: ['IUnitOfWork', DomainEventManager],
    },
  ],
  exports: [ApplicationService],
})
export class ApplicationModule {}
