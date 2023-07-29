import { DomainEventManager } from '../../../../@core/@shared/domain/domain-event-manager';
import { IDomainEventHandler } from '../../../../@core/@shared/application/domain-event-handler.interface';
import { PartnerCreated } from '../../domain/domain-events/partner-created.event';
import { IPartnerRepository } from '../../domain/repositories/partner-repository.interface';

export class MyHandlerHandler implements IDomainEventHandler {
  constructor(
    private partnerRepo: IPartnerRepository,
    private domainEventManager: DomainEventManager,
  ) {}

  async handle(event: PartnerCreated): Promise<void> {
    console.log('MyHandlerHandler', event);
  }

  static listensTo(): string[] {
    return [PartnerCreated.name];
  }
}
