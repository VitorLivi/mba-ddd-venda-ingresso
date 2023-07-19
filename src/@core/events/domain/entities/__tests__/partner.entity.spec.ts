import { Partner } from '../partner.entity';

test('should create a partner', () => {
  const partner = Partner.create({ name: 'Partner 1' });

  const event = partner.initEvent({
    name: 'Event 1',
    description: 'Description 1',
    date: new Date(),
  });
});
