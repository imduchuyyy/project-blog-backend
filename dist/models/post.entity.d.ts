export declare class PostEntity {
    _id: string;
    idCreator: string;
    description: string;
    thumbnails: string;
    idLikes: string[];
    idComments: string[];
    createdAt: number;
    constructor(post: Partial<PostEntity>);
}
