import { DashboardService } from './service/dashboard.service';
import { CreateUserInput, LoginRequest, LoginResponse, UpdateUserInput, User } from './../generator/graphql.schema';
import { UserEntity } from '@models';
export declare class UserResolver {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    hello(): Promise<string>;
    getUsers(): Promise<UserEntity[]>;
    getUser(_id: string): Promise<UserEntity>;
    getCurrentUser(currentUser: UserEntity): Promise<User>;
    createUser(input: CreateUserInput, pubsub: any, currentUser: UserEntity): Promise<UserEntity>;
    login(input: LoginRequest): Promise<LoginResponse>;
    updateUser(currentUser: UserEntity, input: UpdateUserInput): Promise<User>;
}
