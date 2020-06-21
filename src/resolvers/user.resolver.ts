import { DashboardService } from './service/dashboard.service';
import { generateToken } from './../auth/jwt/index';
import { CreateUserInput, LoginRequest, LoginResponse, UpdateUserInput, User, Gender, Role } from './../generator/graphql.schema';
import {
	Resolver,
	Query,
	Mutation,
	Args,
	Context,
} from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import {
	ApolloError,
} from 'apollo-server-core'
import { UserEntity } from '@models';

@Resolver('User')
export class UserResolver {
	constructor(private readonly dashboardService: DashboardService) { }

	@Query()
	async hello(): Promise<string> {
		return 'hello world 123'
	}

	@Query()
	async getUsers(): Promise<UserEntity[]> {
		try {
			return await getMongoRepository(UserEntity).find({})
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Query()
	async getCurrentUser(@Context('currentUser') currentUser: UserEntity): Promise<User> {
		return currentUser
	}

	@Mutation()
	async createUser(@Args('input') input: CreateUserInput, @Context('pubsub') pubsub, @Context('currentUser') currentUser: UserEntity): Promise<UserEntity> {
		try {
			const { username, role, gender } = input

			if ((role !== 'MEMBER') && (!currentUser || currentUser.role !== 'SUPERADMIN')) {
				throw new ApolloError('You dont have permission', '403')
			}

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

			await this.dashboardService.dashboardUpdated(pubsub)

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

			if (!existedUser || !(await existedUser.matchesPassword(password))) {
				throw new ApolloError('Incorrect username or password')
			}

			const token = await generateToken(existedUser)

			return {
				token
			}
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Mutation()
	async updateUser(@Context('currentUser') currentUser: UserEntity, @Args('input') input: UpdateUserInput): Promise<User> {
		try {
			const { _id } = currentUser

			await getMongoRepository(UserEntity).updateOne(
				{
					_id
				},
				{
					$set: {
						...input
					}
				}
			)
			return await getMongoRepository(UserEntity).findOne({
				_id
			})
		} catch (error) {
			throw new ApolloError(error)
		}
	}
}