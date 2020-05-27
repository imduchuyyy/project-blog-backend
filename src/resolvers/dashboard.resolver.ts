import {
	Resolver,
	Subscription,
	Context,
} from '@nestjs/graphql'

@Resolver()
export class DashboardResolver {
	@Subscription('dashboardUpdated', {
		filter: () => {
			return true
		}
	})
	dashboardUpdate(@Context('pubsub') pubsub) {
		return pubsub.asyncIterator('dashboardUpdated')
	}
}