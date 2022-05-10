export class UnknownError extends Error {
  constructor(public message: string) {
    super(message);
  }
}
