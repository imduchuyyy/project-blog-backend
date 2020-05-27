
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum Gender {
    UNKNOWN = "UNKNOWN",
    MALE = "MALE",
    FEMALE = "FEMALE"
}

export enum Role {
    SUPERADMIN = "SUPERADMIN",
    ADMIN = "ADMIN",
    MENBER = "MENBER"
}

export class CreatePostInput {
    description?: string;
    thumbnails?: string[];
}

export class CreateUserInput {
    username?: string;
    password?: string;
    role?: string;
    gender?: string;
    fullName?: string;
}

export class LoginRequest {
    username?: string;
    password?: string;
}

export class UpdateUserInput {
    username?: string;
    password?: string;
    gender?: string;
    role?: string;
    fullName?: string;
}

export class DashboardData {
    numberOfUsers?: number;
    numberOfPosts?: number;
    users?: User[];
    posts?: Post[];
}

export abstract class ISubscription {
    abstract dashboardUpdated(): DashboardData | Promise<DashboardData>;

    abstract newPost(): Post | Promise<Post>;
}

export class Comment {
    _id: string;
    idCreator: string;
    description?: string;
    likes?: string[];
}

export class Post {
    _id: string;
    idCreator: string;
    description?: string;
    thumbnails?: string[];
    likes?: string[];
    comment?: Comment[];
    createdAt: number;
}

export abstract class IQuery {
    abstract posts(): Post | Promise<Post>;

    abstract hello(): string | Promise<string>;

    abstract users(): User[] | Promise<User[]>;
}

export abstract class IMutation {
    abstract createPost(input?: CreatePostInput): Post | Promise<Post>;

    abstract createUser(input?: CreateUserInput): User | Promise<User>;

    abstract login(input?: LoginRequest): LoginResponse | Promise<LoginResponse>;

    abstract updateUser(input?: UpdateUserInput): User | Promise<User>;

    abstract deleteAllMember(): boolean | Promise<boolean>;

    abstract deleteAllAdmin(): boolean | Promise<boolean>;
}

export class User {
    _id: string;
    fullName: string;
    username: string;
    password: string;
    role: Role;
    avatar: string;
    gender: Gender;
    isOnline: boolean;
    createdAt: number;
}

export class LoginResponse {
    token?: string;
}
