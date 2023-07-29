import { ApplicationService } from '../../../@core/@shared/application/application.service';
import { Partner } from '../domain/entities/partner.entity';
import { IPartnerRepository } from '../domain/repositories/partner-repository.interface';

export class PartnerService {
  constructor(
    private partnerRepo: IPartnerRepository,
    private applicationService: ApplicationService,
  ) {}

  list() {
    return this.partnerRepo.findAll();
  }

  async register(input: { name: string }): Promise<Partner> {
    return await this.applicationService.run(async () => {
      const partner = Partner.create(input);
      await this.partnerRepo.add(partner);

      return partner;
    });
  }

  async update(id: string, input: { name?: string }): Promise<Partner> {
    return await this.applicationService.run(async () => {
      const partner = await this.partnerRepo.findById(id);

      if (!partner) {
        throw new Error('Partner not found');
      }

      input.name && partner.changeName(input.name);

      this.partnerRepo.add(partner);
      return partner;
    });
  }
}
