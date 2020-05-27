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
import { Gender, Role } from './../../generator/graphql.schema'
import { UserEntity, PostEntity } from '@models';

@Resolver()
export class DashboardService {
  async dashboardUpdated(pubsub) {
    const users = await getMongoRepository(UserEntity).find()
    const posts = await getMongoRepository(PostEntity).find()

    pubsub.publish('dashboardUpdated', {
      dashboardUpdated: {
        numberOfUsers: users.length,
        numberOfPosts: posts.length,
        posts,
        users
      }
    })
  }
}