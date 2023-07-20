import { EntityManager } from '@mikro-orm/mysql';
import { Partner, PartnerId } from '../../../domain/entities/partner.entity';
import { IPartnerRepository } from '../../../domain/repositories/partner-repository.interface';

export class PartnerMysqlRepository implements IPartnerRepository {
  constructor(private entityManager: EntityManager) {}

  async add(partner: Partner): Promise<void> {
    this.entityManager.persist(partner);
  }

  async findById(id: string | PartnerId): Promise<Partner> {
    return this.entityManager.findOneOrFail(Partner, {
      id: typeof id === 'string' ? new PartnerId(id) : id,
    });
  }

  async findAll(): Promise<Partner[]> {
    return this.entityManager.find(Partner, {});
  }

  async delete(partner: Partner): Promise<void> {
    this.entityManager.remove(partner);
  }
}
