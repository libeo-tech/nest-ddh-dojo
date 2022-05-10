import { HttpException, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Dragon as DragonSchema } from '../../../graphql';
import {
  GenerateNewDragonCommand,
  GenerateNewDragonCommandResult,
} from '../../core/application/commands/generate-new-dragon/generate-new-dragon.command';
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
    const result = await this.queryBus.execute<
      GetAllDragonsQuery,
      GetAllDragonsQueryResult
    >(new GetAllDragonsQuery());

    if (result.isErr()) {
      throw new HttpException(
        {
          message: 'UnknownError occurred on getAllDragons Query',
        },
        500,
      );
    }

    const { dragons } = result.value;
    return dragons.map((dragon) => mapDragonEntityToDragonSchema(dragon));
  }

  @Mutation()
  public async generateNewDragon(
    @Args('input') dragonProperties: Pick<Dragon, 'level' | 'color'>,
  ): Promise<boolean> {
    const result = await this.commandBus.execute<
      GenerateNewDragonCommand,
      GenerateNewDragonCommandResult
    >(new GenerateNewDragonCommand(dragonProperties));

    if (result.isErr()) {
      throw new HttpException(
        {
          message: 'UnknownError occurred on generateNewDragon Mutation',
          payload: dragonProperties,
        },
        500,
      );
    }
    return true;
  }
}
