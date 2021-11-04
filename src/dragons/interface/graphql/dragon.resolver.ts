import {
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { withSpan } from '../../../common/utils/trace/honeycomb';
import { Dragon as DragonSchema } from '../../../graphql';
import { Hero } from '../../../heroes/core/domain/hero.entity';
import { GenerateRandomDragonCommand } from '../../core/application/commands/generate-random-dragon/generate-random-dragon.command';
import { SlayDragonCommand } from '../../core/application/commands/slay-dragon/slay-dragon.command';
import {
  GetAllDragonsQuery,
  GetAllDragonsQueryResult,
} from '../../core/application/queries/get-all-dragons/get-all-dragons.query';
import { DragonNotFoundError } from '../../core/domain/dragon.error';
import { Dragon } from '../../infrastructure/typeorm/dragon.orm-entity';
import { mapDragonEntityToDragonSchema } from './dragon.gql-mapper';

@Resolver('dragon')
export class DragonResolver {
  private readonly logger = new Logger(DragonResolver.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query()
  @withSpan()
  public async getAllDragons(): Promise<DragonSchema[]> {
    const { dragons } = await this.queryBus.execute<
      GetAllDragonsQuery,
      GetAllDragonsQueryResult
    >(new GetAllDragonsQuery());
    return dragons.map((dragon) => mapDragonEntityToDragonSchema(dragon));
  }

  @Mutation()
  @withSpan()
  public async generateRandomDragon(): Promise<boolean> {
    await this.commandBus.execute(new GenerateRandomDragonCommand());
    return true;
  }

  @Mutation()
  @withSpan()
  public async slayDragon(
    @Args('dragonId') dragonId: Dragon['id'],
    @Args('heroId') heroId: Hero['id'],
  ): Promise<boolean> {
    try {
      await this.commandBus.execute(
        new SlayDragonCommand({ dragonId, heroId }),
      );
      return true;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof DragonNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
