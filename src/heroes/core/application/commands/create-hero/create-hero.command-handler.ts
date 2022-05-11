import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ok } from 'neverthrow';
import { CreatePort } from '../../../../../common/core/domain/base.ports';
import { LogPayloadAndResult } from '../../../../../common/utils/handler-decorators/log-payload-and-result.decorator';
import { WrapInTryCatchWithUnknownApplicationError } from '../../../../../common/utils/handler-decorators/wrap-in-try-catch-with-unknown-application-error.decorator';
import { Hero } from '../../../domain/hero.entity';
import {
  CreateHeroCommand,
  CreateHeroCommandResult,
} from './create-hero.command';

@CommandHandler(CreateHeroCommand)
export class CreateHeroCommandHandler
  implements ICommandHandler<CreateHeroCommand>
{
  constructor(@Inject(Hero) private readonly heroPorts: CreatePort<Hero>) {}

  @WrapInTryCatchWithUnknownApplicationError('HeroModule')
  @LogPayloadAndResult('HeroModule')
  public async execute({
    payload,
  }: CreateHeroCommand): Promise<CreateHeroCommandResult> {
    const { name } = payload;

    const hero = await this.heroPorts.create({ name, level: 1 });
    return ok(hero);
  }
}
