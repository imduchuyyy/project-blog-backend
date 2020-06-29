"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const common_1 = require("@nestjs/common");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const typeorm_1 = require("typeorm");
const apollo_server_cache_memcached_1 = require("apollo-server-cache-memcached");
const _models_1 = require("@models");
const schemaDerectives_1 = require("./schemaDerectives");
const _auth_1 = require("@auth");
const _environments_1 = require("@environments");
const pubsub = new graphql_subscriptions_1.PubSub();
let GraphqlService = class GraphqlService {
    createGqlOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                typePaths: ['./**/*.graphql'],
                playground: true,
                schemaDirectives: schemaDerectives_1.default,
                formatError: err => {
                    return {
                        message: err.message,
                        code: err.extensions && err.extensions.code,
                        locations: err.locations,
                        path: err.path
                    };
                },
                tracing: true,
                persistedQueries: {
                    cache: new apollo_server_cache_memcached_1.MemcachedCache(['memcached-server-1', 'memcached-server-2', 'memcached-server-3'], { retries: 10, retry: 10000 })
                },
                onHealthCheck: () => {
                    return new Promise((resolve, reject) => {
                        if (true) {
                            resolve();
                        }
                        else {
                            reject();
                        }
                    });
                },
                formatResponse: res => {
                    return res;
                },
                path: `/${_environments_1.END_POINT}`,
                bodyParserConfig: {
                    limit: '50mb'
                },
                uploads: {
                    maxFieldSize: 2,
                    maxFileSize: 20,
                    maxFiles: 5
                },
                installSubscriptionHandlers: true,
                context: ({ req, res, connection }) => __awaiter(this, void 0, void 0, function* () {
                    if (connection) {
                        const { currentUser } = connection.context;
                        return {
                            pubsub,
                            currentUser
                        };
                    }
                    let currentUser;
                    const token = req.headers[_environments_1.ACCESS_TOKEN] || '';
                    if (token) {
                        currentUser = yield _auth_1.verifyToken(token);
                    }
                    return {
                        req,
                        res,
                        pubsub,
                        currentUser,
                    };
                }),
                subscriptions: {
                    path: `/${_environments_1.END_POINT}`,
                    keepAlive: 1000,
                    onConnect: (connectionParams, webSocket, context) => __awaiter(this, void 0, void 0, function* () {
                        common_1.Logger.debug(`🔗  Connected to websocket`, 'GraphQL');
                        let currentUser;
                        const token = connectionParams[_environments_1.ACCESS_TOKEN] || '';
                        if (token) {
                            currentUser = yield _auth_1.verifyToken(token);
                            yield typeorm_1.getMongoRepository(_models_1.UserEntity).updateOne({ _id: currentUser._id }, {
                                $set: { isOnline: true }
                            }, {
                                upsert: true
                            });
                            return { currentUser };
                        }
                        return false;
                    }),
                    onDisconnect: (webSocket, context) => __awaiter(this, void 0, void 0, function* () {
                        common_1.Logger.error(`❌  Disconnected to websocket`, '', 'GraphQL', false);
                        const { initPromise } = context;
                        const { currentUser } = (yield initPromise) || [];
                        if (currentUser) {
                            yield typeorm_1.getMongoRepository(_models_1.UserEntity).updateOne({ _id: currentUser._id }, {
                                $set: { isOnline: false }
                            }, {
                                upsert: true
                            });
                        }
                    })
                }
            };
        });
    }
};
GraphqlService = __decorate([
    common_1.Injectable()
], GraphqlService);
exports.GraphqlService = GraphqlService;
//# sourceMappingURL=index.js.map