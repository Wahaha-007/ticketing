// Need to extend subclass that match below requirement
// Very similar in nature with interface but slightly different implementation

export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor() {
    super();

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
