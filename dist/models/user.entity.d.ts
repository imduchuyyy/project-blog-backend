import { Gender, Role } from './../generator/graphql.schema';
export declare class UserEntity {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    password: string;
    role: Role;
    avatar: string;
    dayOfBirth: number;
    gender: Gender;
    isOnline: boolean;
    createdAt: number;
    constructor(user: Partial<UserEntity>);
    hashPassword(): Promise<void>;
    matchesPassword(password: any): Promise<any>;
}
