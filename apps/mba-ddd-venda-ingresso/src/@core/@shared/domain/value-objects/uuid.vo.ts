import { ValueObject } from './value-object';
import { validate as uuidValidate, v4 as uuid } from 'uuid';

export class Uuid extends ValueObject<string> {
  constructor(id?: string) {
    super(id || uuid());
    this.validate();
  }

  validate(): void {
    const isValid = uuidValidate(this.value);
    if (!isValid) {
      throw new InvalidUuidError(this.value);
    }
  }
}

export class InvalidUuidError extends Error {
  constructor(invalidValue: any) {
    super(`Invalid uuid: ${invalidValue}`);
    this.name = 'InvalidUuidError';
  }
}
