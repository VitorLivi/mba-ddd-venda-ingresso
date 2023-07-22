import { IUnitOfWork } from '../../@shared/application/unit-of-work.interface';
import { Partner } from '../domain/entities/partner.entity';
import { IPartnerRepository } from '../domain/repositories/partner-repository.interface';

export class PartnerService {
  constructor(
    private partnerRepo: IPartnerRepository,
    private uow: IUnitOfWork,
  ) {}

  list() {
    return this.partnerRepo.findAll();
  }

  async register(input: { name: string }): Promise<Partner> {
    const partner = Partner.create(input);
    this.partnerRepo.add(partner);
    await this.uow.commit();
    return partner;
  }

  async update(id: string, input: { name?: string }): Promise<Partner> {
    const partner = await this.partnerRepo.findById(id);

    if (!partner) {
      throw new Error('Partner not found');
    }

    input.name && partner.changeName(input.name);

    this.partnerRepo.add(partner);
    await this.uow.commit();
    return partner;
  }
}
