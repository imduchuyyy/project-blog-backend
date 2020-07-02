import { DashboardService } from './service/dashboard.service';
import { Post, PostInput, CommentInput, Comment, PersonalProfile } from './../generator/graphql.schema';
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
import { UserEntity, PostEntity, CommentEntity } from '@models';

@Resolver()
export class PostResolver {
  constructor(private readonly dashboardService: DashboardService) { }
  @Query()
  async getPosts(): Promise<Post[]> {
    try {
      const posts = await getMongoRepository(PostEntity).find({})

      const creatorIds = []
      const commentIds = []
      posts.map(item => {
        creatorIds.push(item.idCreator)
        item.idComments.map(item => {
          commentIds.push(item)
        })
      })

      const [creatorsHash, commentsHash] = await Promise.all<any, any>([
        new Promise(async resolve => {
          const hash = {}
          const creators = await getMongoRepository(UserEntity).find({
            where: {
              _id: { $in: creatorIds }
            }
          })
          creators.map(item => (hash[item._id] = item))
          resolve(hash)
        }),
        new Promise(async resolve => {
          const hash = {}
          const comments = await getMongoRepository(CommentEntity).find({
            where: {
              _id: { $in: commentIds }
            }
          })
          comments.map(item => (hash[item._id] = item))
          resolve(hash)
        }),
      ])

      const response = posts.map(item => {
        const comments = []
        item.idComments.map(item => {
          comments.push(commentsHash[item])
        })
        return {
          ...item,
          comments,
          creator: creatorsHash[item.idCreator]
        }
      })

      return response
    } catch (error) {
      throw new ApolloError(error)
    }
  }

  @Query()
  async getPersonalProfile(@Args('username') username): Promise<PersonalProfile> {
    try {
      const creator = await getMongoRepository(UserEntity).findOne({
        username
      })

      if (!creator) {
        throw new ApolloError('Not found: User', '404')
      }

      const posts = await getMongoRepository(PostEntity).find({
        idCreator: creator._id
      })

      return {
        posts,
        creator
      }
    } catch (error) {
      throw new ApolloError(error)
    }
  }

  @Mutation()
  async createNewPost(@Context('pubsub') pubsub, @Context('currentUser') currentUser: UserEntity, @Args('input') input: PostInput): Promise<Post> {
    try {
      const newPost = await getMongoRepository(PostEntity).save(new PostEntity({
        ...input,
        idCreator: currentUser._id,
        createdAt: +new Date(),
      }))
      await this.dashboardService.dashboardUpdated(pubsub)
      return newPost
    } catch (error) {
      throw new ApolloError(error)
    }
  }

  @Mutation()
  async deleteAllPost(@Context('pubsub') pubsub): Promise<boolean> {
    try {
      const deletePost = await getMongoRepository(PostEntity).deleteMany({})
      await getMongoRepository(CommentEntity).deleteMany({})
      await this.dashboardService.dashboardUpdated(pubsub)
      return deletePost.deletedCount > 0
    } catch (error) {
      throw new ApolloError(error)
    }
  }

  @Mutation()
  async deletePost(@Context('pubsub') pubsub, @Args('idPost') idPost, @Context('currentUser') currentUser: UserEntity): Promise<boolean> {
    try {
      const existedPost = await getMongoRepository(PostEntity).findOne({
        _id: idPost
      })

      if (!existedPost) {
        throw new ApolloError('Not found: Post', '404')
      }

      if (existedPost.idCreator !== currentUser._id) {
        throw new ApolloError('Cant delete post', '403')
      }

      const { idComments } = existedPost

      await getMongoRepository(CommentEntity).deleteMany({
        _id: {
          $in: idComments
        }
      })

      const deletePost = await getMongoRepository(PostEntity).deleteOne({
        _id: idPost
      })

      await this.dashboardService.dashboardUpdated(pubsub)
      return deletePost.deletedCount > 0
    } catch (error) {
      throw new ApolloError(error)
    }
  }

  @Mutation()
  async updatePost(@Context('currentUser') currentUser: UserEntity, @Args('input') input: PostInput, @Args('idPost') idPost: string): Promise<Post> {
    try {
      const { _id } = currentUser

      const existedPost = await getMongoRepository(PostEntity).findOne({
        _id: idPost
      })

      if (!existedPost) {
        throw new ApolloError('Not found: Post', '404')
      }

      if (existedPost.idCreator !== currentUser._id) {
        throw new ApolloError('Cant update post', '403')
      }

      await getMongoRepository(PostEntity).updateOne(
        {
          _id: idPost
        },
        {
          $set: {
            ...input
          }
        }
      )

      return await getMongoRepository(PostEntity).findOne({
        _id: idPost
      })
    } catch (error) {
      throw new ApolloError(error)
    }
  }

  @Mutation()
  async toggleLikePost(@Context('currentUser') currentUser: UserEntity, @Args('idPost') idPost: string, @Context('pubsub') pubsub): Promise<boolean> {
    try {
      const existedPost = await getMongoRepository(PostEntity).findOne({
        _id: idPost
      })

      if (!existedPost) {
        throw new ApolloError('Not found: Post', '409')
      }

      let { idLikes } = existedPost
      if (idLikes.indexOf(currentUser._id) === -1) {
        idLikes.push(currentUser._id)
        await getMongoRepository(PostEntity).updateOne(
          {
            _id: idPost
          },
          {
            $set: {
              idLikes
            }
          }
        )
        await this.dashboardService.dashboardUpdated(pubsub)
        return true
      } else {
        idLikes.splice(idLikes.indexOf(currentUser._id), 1)
        await getMongoRepository(PostEntity).updateOne(
          {
            _id: idPost
          },
          {
            $set: {
              idLikes
            }
          }
        )
        await this.dashboardService.dashboardUpdated(pubsub)
        return false
      }
    } catch (error) {
      throw new ApolloError(error)
    }
  }

  @Mutation()
  async commentOnPost(@Context('currentUser') currentUser: UserEntity, @Args('idPost') idPost: string, @Args('input') input: CommentInput): Promise<Comment> {
    try {
      const existedPost = await getMongoRepository(PostEntity).findOne({
        _id: idPost
      })

      if (!existedPost) {
        throw new ApolloError('Not fount: Post', '404')
      }

      const newComment = await getMongoRepository(CommentEntity).save(new CommentEntity({
        ...input,
        idCreator: currentUser._id
      }))

      const { idComments } = existedPost
      idComments.push(newComment._id)
      await getMongoRepository(PostEntity).updateOne(
        {
          _id: idPost
        },
        {
          $set: {
            idComments
          }
        }
      )
      return newComment
    } catch (error) {
      throw new ApolloError(error)
    }
  }

  @Mutation()
  async deleteComment(@Args('idPost') idPost: string, @Args('idComment') idComment: string, @Context('currentUser') currentUser: UserEntity): Promise<boolean> {
    try {
      const existedPost = await getMongoRepository(PostEntity).findOne({
        _id: idPost
      })
      const existedComment = await getMongoRepository(CommentEntity).findOne({
        _id: idComment
      })

      if (!existedPost) {
        throw new ApolloError('Not found: Post', '404')
      }
      if (!existedComment) {
        throw new ApolloError('Not found: Comment', '404')
      }

      if (existedComment.idCreator !== currentUser._id) {
        throw new ApolloError('Cant delete comment', '403')
      }

      const { idComments } = existedPost
      idComments.splice(idComments.indexOf(existedComment._id), 1)
      await getMongoRepository(PostEntity).updateOne(
        {
          _id: idPost
        },
        {
          $set: {
            idComments
          }
        }
      )

      const deleteComment = await getMongoRepository(CommentEntity).deleteOne({
        _id: idComment
      })

      return deleteComment.deletedCount > 0
    } catch (error) {
      throw new ApolloError(error)
    }
  }

  @Mutation()
  async updateComment(@Args('idComment') idComment: string, @Args('input') input: CommentInput, @Context('currentUser') currentUser: UserEntity): Promise<Comment> {
    try {
      const existedComment = await getMongoRepository(CommentEntity).findOne({
        _id: idComment
      })

      if (!existedComment) {
        throw new ApolloError('Not found: Comment', '404')
      }

      if (existedComment.idCreator !== currentUser._id) {
        throw new ApolloError('Cant update comment', '403')
      }

      await getMongoRepository(CommentEntity).updateOne(
        {
          _id: idComment
        },
        {
          $set: {
            ...input
          }
        }
      )

      return await getMongoRepository(CommentEntity).findOne({
        _id: idComment
      })
    } catch (error) {
      throw new ApolloError(error)
    }
  }

  @Mutation()
  async toggleLikeComment(@Args('idComment') idComment: string, @Context('currentUser') currentUser: UserEntity): Promise<boolean> {
    try {
      const existedComment = await getMongoRepository(CommentEntity).findOne({
        _id: idComment
      })

      if (!existedComment) {
        throw new ApolloError('Not found: Comment', '409')
      }

      let { idLikes } = existedComment

      if (idLikes.indexOf(currentUser._id) === -1) {
        idLikes.push(currentUser._id)
        await getMongoRepository(CommentEntity).updateOne(
          {
            _id: idComment
          },
          {
            $set: {
              idLikes
            }
          }
        )
        return true
      } else {
        idLikes.splice(idLikes.indexOf(currentUser._id), 1)
        await getMongoRepository(CommentEntity).updateOne(
          {
            _id: idComment
          },
          {
            $set: {
              idLikes
            }
          }
        )
        return false
      }
    } catch (error) {
      throw new ApolloError(error)
    }
  }
}