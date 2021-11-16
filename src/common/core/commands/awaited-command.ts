import { ICommand } from '@nestjs/cqrs';

export class AwaitedCommand implements ICommand {
  public async await(): Promise<void> {
    await new Promise((resolve) => (this.afterHook = () => resolve(null)));
  }
  public afterHook: () => void;

  public end(): void {
    if (this.afterHook) {
      this.afterHook();
    }
  }
}
