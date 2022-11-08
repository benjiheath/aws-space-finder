import { Space } from './model';

export class MissingFieldError extends Error {
  constructor(field: string) {
    super(`Missing required field: ${field}`);
  }
}

export const validateAsSpaceEntry = (arg: any): Space => {
  const expectedFields: (keyof Space)[] = ['spaceId', 'name', 'whereabouts'];

  expectedFields.forEach((field) => {
    if (!arg[field]) {
      throw new MissingFieldError(field);
    }
  });

  return arg;
};
