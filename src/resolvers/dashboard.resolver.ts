import { getMongoRepository } from 'typeorm';
import {
	Resolver,
	Subscription,
	Context,
	Mutation,
} from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import { UserEntity } from '@models';

@Resolver()
export class DashboardResolver {
	@Subscription('dashboardUpdated', {
		filter: () => {
			return true
		}
	})
	dashboardUpdate(@Context('pubsub') pubsub) {
		if (!pubsub) {
			throw new ApolloError('Error pubsub')
		}
		return pubsub.asyncIterator('dashboardUpdated')
	}

	@Mutation()
	async deleteAllMember(): Promise<boolean> {
		try {
			const deleteMember = await getMongoRepository(UserEntity).deleteMany({
				role: 'MEMBER'
			})

			return deleteMember.deletedCount > 0
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Mutation()
	async deleteAllAdmin(): Promise<boolean> {
		try {
			const deleteMember = await getMongoRepository(UserEntity).deleteMany({
				role: 'ADMIN'
			})

			return deleteMember.deletedCount > 0
		} catch (error) {
			throw new ApolloError(error)
		}
	}
}