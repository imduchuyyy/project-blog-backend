import { DashboardService } from './service/dashboard.service';
import { Post, PostInput, CommentInput, Comment } from './../generator/graphql.schema';
import { UserEntity } from '@models';
export declare class PostResolver {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getPosts(): Promise<Post[]>;
    createNewPost(pubsub: any, currentUser: UserEntity, input: PostInput): Promise<Post>;
    deleteAllPost(pubsub: any): Promise<boolean>;
    deletePost(pubsub: any, idPost: any, currentUser: UserEntity): Promise<boolean>;
    updatePost(currentUser: UserEntity, input: PostInput, idPost: string): Promise<Post>;
    toggleLikePost(currentUser: UserEntity, idPost: string, pubsub: any): Promise<boolean>;
    commentOnPost(currentUser: UserEntity, idPost: string, input: CommentInput): Promise<Comment>;
    deleteComment(idPost: string, idComment: string, currentUser: UserEntity): Promise<boolean>;
    updateComment(idComment: string, input: CommentInput, currentUser: UserEntity): Promise<Comment>;
    toggleLikeComment(idComment: string, currentUser: UserEntity): Promise<boolean>;
}
