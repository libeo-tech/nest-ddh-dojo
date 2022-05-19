import { InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Dragon as DragonSchema, DragonCreationInput } from '../../../graphql';
import {
  GenerateNewDragonCommand,
  GenerateNewDragonCommandResult,
} from '../../core/application/commands/generate-new-dragon/generate-new-dragon.command';
import {
  GetAllDragonsQuery,
  GetAllDragonsQueryResult,
} from '../../core/application/queries/get-all-dragons/get-all-dragons.query';
import {
  mapDragonEntityToDragonSchema,
  mapDragonInputToDragonProperties,
} from './dragon.gql-mapper';

@Resolver('Dragon')
export class DragonResolver {
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
      throw new InternalServerErrorException();
    }

    const { dragons } = result.value;
    return dragons.map((dragon) => mapDragonEntityToDragonSchema(dragon));
  }

  @Mutation()
  public async generateNewDragon(
    @Args('input') dragonInput: DragonCreationInput,
  ): Promise<boolean> {
    const dragonProperties = mapDragonInputToDragonProperties(dragonInput);
    const result = await this.commandBus.execute<
      GenerateNewDragonCommand,
      GenerateNewDragonCommandResult
    >(new GenerateNewDragonCommand(dragonProperties));

    if (result.isErr()) {
      throw new InternalServerErrorException();
    }
    return true;
  }
}
