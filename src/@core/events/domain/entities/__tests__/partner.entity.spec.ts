import { Partner } from '../partner.entity';

test('should create a event', () => {


  const partner = Partner.create({ name: 'Partner 1' });

  const event = partner.initEvent({
    name: 'Event 1',
    description: 'Event 1 description',
    date: new Date(),
  });

  expect(event).toBeDefined();
});
