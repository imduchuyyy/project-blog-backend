import { Entity, ObjectIdColumn, Column } from 'typeorm'
import * as uuid from 'uuid'
import { Expose, plainToClass } from 'class-transformer'
import { Comment } from './../generator/graphql.schema';

@Entity({
  name: 'posts'
})
export class PostEntity {
  @Expose()
  @ObjectIdColumn()
  _id: string

  @Expose()
  @Column()
  idCreator: string

  @Expose()
  @Column()
  description: string

  @Expose()
  @Column()
  thumbnails: [string]

  @Expose()
  @Column()
  likes: [string]

  @Expose()
  @Column()
  comments: [Comment]

  @Expose()
  @Column()
  createdAt: number

  constructor(post: Partial<PostEntity>) {
    if (post) {
      Object.assign(
        this,
        plainToClass(PostEntity, post, {
          excludeExtraneousValues: true
        })
      )
      this._id = this._id || uuid.v1()
      this.createdAt = this.createdAt || +new Date()
    }
  }
}