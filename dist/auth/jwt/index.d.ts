import { UserEntity } from './../../models';
export declare const generateToken: (user: UserEntity) => Promise<string>;
export declare const verifyToken: (token: string) => Promise<UserEntity>;
