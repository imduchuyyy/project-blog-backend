import {
	Resolver,
	Subscription,
	Context,
} from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'

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
}