export declare class CommentEntity {
    _id: string;
    idCreator: string;
    description: string;
    idLikes: string[];
    createdAt: number;
    constructor(comment: Partial<CommentEntity>);
}
