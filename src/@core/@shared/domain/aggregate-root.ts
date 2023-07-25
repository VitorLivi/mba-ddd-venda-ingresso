import { IDomainEvent } from './domain-event';
import { Entity } from './entity';

export abstract class AggregateRoot extends Entity {
  events: Set<IDomainEvent> = new Set<IDomainEvent>();

  addEvent(event: IDomainEvent): void {
    this.events.add(event);
  }

  clearEvents(): void {
    this.events.clear();
  }
}
