import { getMongoRepository } from 'typeorm'
import * as moment from 'moment'
import { UserEntity, PostEntity } from '@models';

export class DashboardService {
  async dashboardUpdated(pubsub) {
    const users = await getMongoRepository(UserEntity).find({})
    const posts = await getMongoRepository(PostEntity).find({})
    const usersHash = {}

    users.map(item => {
      usersHash[item._id] = item
    })

    const topUsersId = posts.reduce((obj, value) => {
      if (obj[value.idCreator]) {
        obj[value.idCreator]++;
      } else {
        obj[value.idCreator] = 1
      }
      return obj
    }, {})

    let maxValue: number = 0
    let topUserId: string
    Object.keys(topUsersId).forEach(key => {
      if (topUsersId[key] >= maxValue) {
        topUserId = key
      }
      maxValue = topUsersId[key]
    })

    const topPost = posts.length > 0 ? posts?.sort((a, b) => {
      return b?.idLikes.length - a?.idLikes.length
    })[0] : {}

    const today = [moment().subtract(23, 'hours').startOf('days').valueOf(), moment().valueOf()]
    const last1Day = [moment().subtract(1, 'days').startOf('days').valueOf(), moment().subtract(1, 'days').endOf('days').valueOf()]
    const last2Day = [moment().subtract(2, 'days').startOf('days').valueOf(), moment().subtract(2, 'days').endOf('days').valueOf()]
    const last3Day = [moment().subtract(3, 'days').startOf('days').valueOf(), moment().subtract(3, 'days').endOf('days').valueOf()]
    const last4Day = [moment().subtract(4, 'days').startOf('days').valueOf(), moment().subtract(4, 'days').endOf('days').valueOf()]
    const last5Day = [moment().subtract(5, 'days').startOf('days').valueOf(), moment().subtract(5, 'days').endOf('days').valueOf()]
    const last6Day = [moment().subtract(6, 'days').startOf('days').valueOf(), moment().subtract(6, 'days').endOf('days').valueOf()]

    const postsInWeek = [0, 0, 0, 0, 0, 0, 0]

    posts.map(item => {
      if (item.createdAt >= today[0] && item.createdAt <= today[1]) {
        postsInWeek[0]++
      }
      if (item.createdAt >= last1Day[0] && item.createdAt <= last1Day[1]) {
        postsInWeek[1]++
      }
      if (item.createdAt >= last2Day[0] && item.createdAt <= last2Day[1]) {
        postsInWeek[2]++
      }
      if (item.createdAt >= last3Day[0] && item.createdAt <= last3Day[1]) {
        postsInWeek[3]++
      }
      if (item.createdAt >= last4Day[0] && item.createdAt <= last4Day[1]) {
        postsInWeek[4]++
      }
      if (item.createdAt >= last5Day[0] && item.createdAt <= last5Day[1]) {
        postsInWeek[5]++
      }
      if (item.createdAt >= last6Day[0] && item.createdAt <= last6Day[1]) {
        postsInWeek[6]++
      }
    })

    pubsub.publish('dashboardUpdated', {
      dashboardUpdated: {
        numberOfUsers: users.length,
        numberOfPosts: posts.length,
        topUser: usersHash[topUserId],
        topPost,
        postsInWeek
      }
    })
  }
}