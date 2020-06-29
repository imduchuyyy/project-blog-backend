"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_service_1 = require("./service/dashboard.service");
const index_1 = require("./../auth/jwt/index");
const graphql_schema_1 = require("./../generator/graphql.schema");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const apollo_server_core_1 = require("apollo-server-core");
const _models_1 = require("@models");
let UserResolver = class UserResolver {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    hello() {
        return __awaiter(this, void 0, void 0, function* () {
            return 'hello world	';
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield typeorm_1.getMongoRepository(_models_1.UserEntity).find({});
            }
            catch (error) {
                throw new apollo_server_core_1.ApolloError(error);
            }
        });
    }
    getCurrentUser(currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            return currentUser;
        });
    }
    createUser(input, pubsub, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, role, gender } = input;
                if ((role !== 'MEMBER') && (!currentUser || currentUser.role !== 'SUPERADMIN')) {
                    throw new apollo_server_core_1.ApolloError('You dont have permission', '403');
                }
                const existedUser = yield typeorm_1.getMongoRepository(_models_1.UserEntity).findOne({
                    username: username
                });
                if (existedUser) {
                    throw new apollo_server_core_1.ApolloError('Username has already existed');
                }
                const newUser = yield typeorm_1.getMongoRepository(_models_1.UserEntity).save(new _models_1.UserEntity(Object.assign(Object.assign({}, input), { role: graphql_schema_1.Role[role], gender: graphql_schema_1.Gender[gender] })));
                yield this.dashboardService.dashboardUpdated(pubsub);
                return newUser;
            }
            catch (error) {
                throw new apollo_server_core_1.ApolloError(error);
            }
        });
    }
    login(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = input;
                const existedUser = yield typeorm_1.getMongoRepository(_models_1.UserEntity).findOne({
                    username
                });
                if (!existedUser || !(yield existedUser.matchesPassword(password))) {
                    throw new apollo_server_core_1.ApolloError('Incorrect username or password');
                }
                const token = yield index_1.generateToken(existedUser);
                return {
                    token
                };
            }
            catch (error) {
                throw new apollo_server_core_1.ApolloError(error);
            }
        });
    }
    updateUser(currentUser, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = currentUser;
                yield typeorm_1.getMongoRepository(_models_1.UserEntity).updateOne({
                    _id
                }, {
                    $set: Object.assign({}, input)
                });
                return yield typeorm_1.getMongoRepository(_models_1.UserEntity).findOne({
                    _id
                });
            }
            catch (error) {
                throw new apollo_server_core_1.ApolloError(error);
            }
        });
    }
};
__decorate([
    graphql_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "hello", null);
__decorate([
    graphql_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUsers", null);
__decorate([
    graphql_1.Query(),
    __param(0, graphql_1.Context('currentUser')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_models_1.UserEntity]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getCurrentUser", null);
__decorate([
    graphql_1.Mutation(),
    __param(0, graphql_1.Args('input')), __param(1, graphql_1.Context('pubsub')), __param(2, graphql_1.Context('currentUser')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [graphql_schema_1.CreateUserInput, Object, _models_1.UserEntity]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
__decorate([
    graphql_1.Mutation(),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [graphql_schema_1.LoginRequest]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    graphql_1.Mutation(),
    __param(0, graphql_1.Context('currentUser')), __param(1, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_models_1.UserEntity, graphql_schema_1.UpdateUserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateUser", null);
UserResolver = __decorate([
    graphql_1.Resolver('User'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.resolver.js.map