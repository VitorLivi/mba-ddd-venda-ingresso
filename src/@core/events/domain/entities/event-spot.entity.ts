import { Entity } from '../../../@shared/domain/entity';
import { Uuid } from '../../../@shared/domain/value-objects/uuid.vo';

export class EventSpotId extends Uuid {}

export interface EventSpotConstructorProps {
  id?: EventSpotId | string;
  location: string | null;
  is_reserved: boolean;
  is_published: boolean;
}

export class EventSpot extends Entity {
  id: EventSpotId;
  location: string | null;
  is_reserved: boolean;
  is_published: boolean;

  constructor(props: EventSpotConstructorProps) {
    super();

    this.id = props.id ? (props.id instanceof EventSpotId ? props.id : new EventSpotId(props.id)) : new EventSpotId();
    this.location = props.location;
    this.is_reserved = props.is_reserved;
    this.is_published = props.is_published;
  }

  static create(): EventSpot {
    return new EventSpot({
      location: null,
      is_published: false,
      is_reserved: false,
    });
  }

  changeLocation(location: string): void {
    this.location = location;
  }

  publish(): void {
    this.is_published = true;
  }

  unPublish(): void {
    this.is_published = false;
  }

  toJSON() {
    return {
      id: this.id.value,
      location: this.location,
      is_reserved: this.is_reserved,
      is_published: this.is_published,
    };
  }
}
