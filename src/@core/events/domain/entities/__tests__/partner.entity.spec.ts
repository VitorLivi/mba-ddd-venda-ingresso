import { Partner } from '../partner.entity';

test('should create a partner', () => {
  const partner = Partner.create({ name: 'Partner 1' });
});
