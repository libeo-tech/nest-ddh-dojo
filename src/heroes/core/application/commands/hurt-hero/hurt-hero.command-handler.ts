import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok } from 'neverthrow';
import {
  GetByIdPort,
  UpdatePort,
} from '../../../../../common/core/domain/base.ports';
import { LogPayloadAndResult } from '../../../../../common/utils/handler-decorators/log-payload-and-result.decorator';
import { WrapInTryCatchWithUnknownApplicationError } from '../../../../../common/utils/handler-decorators/wrap-in-try-catch-with-unknown-application-error.decorator';
import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';
import { HurtHeroCommand, HurtHeroCommandResult } from './hurt-hero.command';

@CommandHandler(HurtHeroCommand)
export class HurtHeroCommandHandler
  implements ICommandHandler<HurtHeroCommand>
{
  constructor(
    @Inject(Hero)
    private readonly heroPorts: GetByIdPort<Hero> & UpdatePort<Hero>,
  ) {}

  @WrapInTryCatchWithUnknownApplicationError('HeroModule')
  @LogPayloadAndResult('HeroModule')
  public async execute({
    payload,
  }: HurtHeroCommand): Promise<HurtHeroCommandResult> {
    const { heroId, damage } = payload;

    const hero = await this.heroPorts.getById(heroId);
    if (!hero) {
      return err(new HeroNotFoundError(heroId));
    }

    const newHp = hero.currentHp - damage.value;
    await this.heroPorts.update(heroId, {
      currentHp: newHp,
    });
    return ok(void 0);
  }
}
