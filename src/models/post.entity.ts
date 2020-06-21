import { Entity, ObjectIdColumn, Column } from 'typeorm'
import * as uuid from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

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
  thumbnails: string

  @Expose()
  @Column()
  idLikes: string[]

  @Expose()
  @Column()
  idComments: string[]

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
      this.idComments = []
      this.idLikes = []
      this.createdAt = this.createdAt || +new Date()
    }
  }
}