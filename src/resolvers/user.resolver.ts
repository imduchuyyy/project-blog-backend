import { generateToken } from './../auth/jwt/index';
import { CreateUserInput, LoginRequest, LoginResponse } from './../generator/graphql.schema';
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
export class UserResolver {
	@Query()
	async hello(): Promise<string> {
		return '1234'
	}

	@Mutation()
	async createUser(@Args('input') input: CreateUserInput): Promise<UserEntity> {
		try {
			const { username, role, gender } = input

			const existedUser = await getMongoRepository(UserEntity).findOne({
				username: username
			})
			if (existedUser) {
				throw new ApolloError('Username has already existed')
			}

			const newUser = await getMongoRepository(UserEntity).save(
				new UserEntity({
					...input,
					role: Role[role],
					gender: Gender[gender]
				})
			)

			return newUser

		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Mutation()
	async login(@Args('input') input: LoginRequest): Promise<LoginResponse> {
		try {
			const { username, password } = input

			const existedUser = await getMongoRepository(UserEntity).findOne({
				username
			})
			if (!existedUser || (await existedUser.matchesPassword(password))) {
				throw new ApolloError('Incorrect username or password')
			}

			console.log(existedUser)

			const token = await generateToken(existedUser)

			return {
				token
			}
		} catch (error) {
			throw new ApolloError(error)
		}
	}
}