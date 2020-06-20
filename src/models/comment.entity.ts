import { Entity, ObjectIdColumn, Column } from 'typeorm'
import * as uuid from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
  name: 'comments'
})
export class CommentEntity {
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
  idLikes: string[]

  @Expose()
  @Column()
  createdAt: number

  constructor(comment: Partial<CommentEntity>) {
    if (comment) {
      Object.assign(
        this,
        plainToClass(CommentEntity, comment, {
          excludeExtraneousValues: true
        })
      )
      this._id = this._id || uuid.v1()
      this.idLikes = []
      this.createdAt = this.createdAt || +new Date()
    }
  }
}