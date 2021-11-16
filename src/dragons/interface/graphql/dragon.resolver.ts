import { Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { withSpan } from '../../../common/utils/trace/honeycomb';
import { Dragon as DragonSchema } from '../../../graphql';
import { GenerateRandomDragonCommand } from '../../core/application/commands/generate-random-dragon/generate-random-dragon.command';
import {
  GetAllDragonsQuery,
  GetAllDragonsQueryResult,
} from '../../core/application/queries/get-all-dragons/get-all-dragons.query';
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
}
