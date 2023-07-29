import { Name } from './name.vo';

test('should create a valid name value object', () => {
  const name = new Name('John Doe');

  expect(name.value).toBe('John Doe');
});
