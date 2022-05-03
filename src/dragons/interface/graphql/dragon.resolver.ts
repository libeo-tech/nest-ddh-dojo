import { Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Dragon as DragonSchema } from '../../../graphql';
import { GenerateNewDragonCommand } from '../../core/application/commands/generate-new-dragon/generate-new-dragon.command';
import {
  GetAllDragonsQuery,
  GetAllDragonsQueryResult,
} from '../../core/application/queries/get-all-dragons/get-all-dragons.query';
import { Dragon } from '../../core/domain/dragon.entity';
import { mapDragonEntityToDragonSchema } from './dragon.gql-mapper';

@Resolver('dragon')
export class DragonResolver {
  private readonly logger = new Logger(DragonResolver.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query()
  public async getAllDragons(): Promise<DragonSchema[]> {
    const { dragons } = await this.queryBus.execute<
      GetAllDragonsQuery,
      GetAllDragonsQueryResult
    >(new GetAllDragonsQuery());
    return dragons.map((dragon) => mapDragonEntityToDragonSchema(dragon));
  }

  @Mutation()
  public async generateNewDragon(
    @Args('input') dragonProperties: Pick<Dragon, 'level' | 'color'>,
  ): Promise<boolean> {
    await this.commandBus.execute(
      new GenerateNewDragonCommand(dragonProperties),
    );
    return true;
  }
}
