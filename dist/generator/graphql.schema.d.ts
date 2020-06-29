export declare enum Gender {
    UNKNOWN = "UNKNOWN",
    MALE = "MALE",
    FEMALE = "FEMALE"
}
export declare enum Role {
    SUPERADMIN = "SUPERADMIN",
    ADMIN = "ADMIN",
    MEMBER = "MEMBER"
}
export declare class PostInput {
    description?: string;
    thumbnails?: string;
}
export declare class CommentInput {
    description?: string;
}
export declare class CreateUserInput {
    username?: string;
    password?: string;
    role?: string;
    email?: string;
    gender?: string;
    fullName?: string;
}
export declare class LoginRequest {
    username?: string;
    password?: string;
}
export declare class UpdateUserInput {
    username?: string;
    password?: string;
    email?: string;
    gender?: string;
    fullName?: string;
}
export declare class DashboardData {
    numberOfUsers?: number;
    numberOfPosts?: number;
    postsInWeek?: number[];
    topUser?: User;
    topPost?: Post;
}
export declare abstract class IQuery {
    abstract dashboardData(): DashboardData | Promise<DashboardData>;
    abstract getPosts(): Post[] | Promise<Post[]>;
    abstract hello(): string | Promise<string>;
    abstract getUsers(): User[] | Promise<User[]>;
    abstract getCurrentUser(): User | Promise<User>;
}
export declare abstract class ISubscription {
    abstract dashboardUpdated(): DashboardData | Promise<DashboardData>;
}
export declare class Comment {
    _id?: string;
    idCreator?: string;
    description?: string;
    idLikes?: string[];
    createdAt?: number;
}
export declare class Post {
    _id?: string;
    idCreator?: string;
    idComments?: string[];
    idLikes?: string[];
    description?: string;
    thumbnails?: string;
    createdAt?: number;
    creator?: User;
    liker?: User[];
    comments?: Comment[];
}
export declare abstract class IMutation {
    abstract createNewPost(input?: PostInput): Post | Promise<Post>;
    abstract deletePost(idPost?: string): boolean | Promise<boolean>;
    abstract deleteAllPost(): boolean | Promise<boolean>;
    abstract updatePost(idPost?: string, input?: PostInput): Post | Promise<Post>;
    abstract toggleLikePost(idPost?: string): boolean | Promise<boolean>;
    abstract commentOnPost(idPost?: string, input?: CommentInput): Comment | Promise<Comment>;
    abstract deleteComment(idPost?: string, idComment?: string): boolean | Promise<boolean>;
    abstract updateComment(idComment?: string, input?: CommentInput): Comment | Promise<Comment>;
    abstract toggleLikeComment(idComment?: string): boolean | Promise<boolean>;
    abstract createUser(input?: CreateUserInput): User | Promise<User>;
    abstract login(input?: LoginRequest): LoginResponse | Promise<LoginResponse>;
    abstract updateUser(input?: UpdateUserInput): User | Promise<User>;
    abstract deleteAllMember(): boolean | Promise<boolean>;
    abstract deleteAllAdmin(): boolean | Promise<boolean>;
}
export declare class User {
    _id?: string;
    fullName?: string;
    username?: string;
    password?: string;
    role?: Role;
    email?: string;
    dayOfBirth?: number;
    avatar?: string;
    gender?: Gender;
    isOnline?: boolean;
    createdAt?: number;
}
export declare class LoginResponse {
    token?: string;
}