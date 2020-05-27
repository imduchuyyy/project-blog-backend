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

@Resolver()
export class DashboardResolver {
    @Subscription('dashboardUpdated', {
        filter: () => {
            return true
        }
    })
    dashboardUpdate(@Context('pubsub') pubsub) {
        console.log(pubsub)
        return pubsub.asyncIterator('dashboardUpdated')
    }
    
}