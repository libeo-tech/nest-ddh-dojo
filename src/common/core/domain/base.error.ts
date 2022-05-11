export class UnknownApplicationError extends Error {
  constructor(public message: string) {
    super(message);
  }
}
