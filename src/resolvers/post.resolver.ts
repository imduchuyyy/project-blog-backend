import { DashboardService } from './service/dashboard.service';
import { generateToken } from './../auth/jwt/index';
import { CreateUserInput, LoginRequest, LoginResponse, UpdateUserInput } from './../generator/graphql.schema';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Subscription,
  Context,
  ResolveProperty,
  Parent
} from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  UserInputError
} from 'apollo-server-core'
import * as uuid from 'uuid'
import { Gender, Role } from './../generator/graphql.schema'
import { UserEntity } from '@models';

@Resolver()
export class PostResolver {

  constructor(private readonly dashboardService: DashboardService) { }

  @Mutation()
  async createNewPost(@Context('pubsub') pubsub) {
    try {
      await this.dashboardService.dashboardUpdated(pubsub)
    } catch (error) {
      throw new ApolloError(error)
    }
  }
}