import { IDomainEvent } from '../../../@shared/domain/domain-event';
import { PartnerId } from '../entities/partner.entity';

export class PartnerChangedName implements IDomainEvent {
  readonly event_version = 1;
  readonly occurred_on: Date = new Date();

  constructor(readonly aggregate_id: PartnerId, readonly name: string) {
    this.occurred_on = new Date();
  }
}
