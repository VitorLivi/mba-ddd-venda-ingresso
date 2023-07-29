import { EntityManager } from '@mikro-orm/mysql';
import { EventSpotId } from '../../../domain/entities/event-spot.entity';
import { SpotReservation } from '../../../domain/entities/spot-reservation.entity';
import { ISpotReservationRepository } from '../../../domain/repositories/spot-reservation-repository.interface';

export class SpotReservationMysqlRepository
  implements ISpotReservationRepository {
  constructor(private entityManager: EntityManager) { }

  async add(spotReservation: SpotReservation): Promise<void> {
    this.entityManager.persist(spotReservation);
  }

  async findById(spot_id: string | EventSpotId): Promise<SpotReservation> {
    return this.entityManager.findOne(SpotReservation, {
      spot_id: typeof spot_id === 'string' ? new EventSpotId(spot_id) : spot_id,
    });
  }

  async findAll(): Promise<SpotReservation[]> {
    return this.entityManager.find(SpotReservation, {});
  }

  async delete(spotReservation: SpotReservation): Promise<void> {
    this.entityManager.remove(spotReservation);
  }
}
