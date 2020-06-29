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
const graphql_schema_1 = require("./../generator/graphql.schema");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const apollo_server_core_1 = require("apollo-server-core");
const _models_1 = require("@models");
let PostResolver = class PostResolver {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield typeorm_1.getMongoRepository(_models_1.PostEntity).find({});
                const creatorIds = [];
                const commentIds = [];
                posts.map(item => {
                    creatorIds.push(item.idCreator);
                    item.idComments.map(item => {
                        commentIds.push(item);
                    });
                });
                const [creatorsHash, commentsHash] = yield Promise.all([
                    new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        const hash = {};
                        const creators = yield typeorm_1.getMongoRepository(_models_1.UserEntity).find({
                            where: {
                                _id: { $in: creatorIds }
                            }
                        });
                        creators.map(item => (hash[item._id] = item));
                        resolve(hash);
                    })),
                    new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        const hash = {};
                        const comments = yield typeorm_1.getMongoRepository(_models_1.CommentEntity).find({
                            where: {
                                _id: { $in: commentIds }
                            }
                        });
                        comments.map(item => (hash[item._id] = item));
                        resolve(hash);
                    })),
                ]);
                const response = posts.map(item => {
                    const comments = [];
                    item.idComments.map(item => {
                        comments.push(commentsHash[item]);
                    });
                    return Object.assign(Object.assign({}, item), { comments, creator: creatorsHash[item.idCreator] });
                });
                return response;
            }
            catch (error) {
                throw new apollo_server_core_1.ApolloError(error);
            }
        });
    }
    createNewPost(pubsub, currentUser, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newPost = yield typeorm_1.getMongoRepository(_models_1.PostEntity).save(new _models_1.PostEntity(Object.assign(Object.assign({}, input), { idCreator: currentUser._id, createdAt: +new Date() })));
                yield this.dashboardService.dashboardUpdated(pubsub);
                return newPost;
            }
            catch (error) {
                throw new apollo_server_core_1.ApolloError(error);
            }
        });
    }
    deleteAllPost(pubsub) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletePost = yield typeorm_1.getMongoRepository(_models_1.PostEntity).deleteMany({});
                yield typeorm_1.getMongoRepository(_models_1.CommentEntity).deleteMany({});
                yield this.dashboardService.dashboardUpdated(pubsub);
                return deletePost.deletedCount > 0;
            }
            catch (error) {
                throw new apollo_server_core_1.ApolloError(error);
            }
        });
    }
    deletePost(pubsub, idPost, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existedPost = yield typeorm_1.getMongoRepository(_models_1.PostEntity).findOne({
                    _id: idPost
                });
                if (!existedPost) {
                    throw new apollo_server_core_1.ApolloError('Not found: Post', '404');
                }
                if (existedPost.idCreator !== currentUser._id) {
                    throw new apollo_server_core_1.ApolloError('Cant delete post', '403');
                }
                const { idComments } = existedPost;
                yield typeorm_1.getMongoRepository(_models_1.CommentEntity).deleteMany({
                    _id: {
                        $in: idComments
                    }
                });
                const deletePost = yield typeorm_1.getMongoRepository(_models_1.PostEntity).deleteOne({
                    _id: idPost
                });
                yield this.dashboardService.dashboardUpdated(pubsub);
                return deletePost.deletedCount > 0;
            }
            catch (error) {
                throw new apollo_server_core_1.ApolloError(error);
            }
        });
    }
    updatePost(currentUser, input, idPost) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = currentUser;
                const existedPost = yield typeorm_1.getMongoRepository(_models_1.PostEntity).findOne({
                    _id: idPost
                });
                if (!existedPost) {
                    throw new apollo_server_core_1.ApolloError('Not found: Post', '404');
                }
                if (existedPost.idCreator !== currentUser._id) {
                    throw new apollo_server_core_1.ApolloError('Cant update post', '403');
                }
                yield typeorm_1.getMongoRepository(_models_1.PostEntity).updateOne({
                    _id: idPost
                }, {
                    $set: Object.assign({}, input)
                });
                return yield typeorm_1.getMongoRepository(_models_1.PostEntity).findOne({
                    _id: idPost
                });
            }
            catch (error) {
                throw new apollo_server_core_1.ApolloError(error);
            }
        });
    }
    toggleLikePost(currentUser, idPost, pubsub) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existedPost = yield typeorm_1.getMongoRepository(_models_1.PostEntity).findOne({
                    _id: idPost
                });
                if (!existedPost) {
                    throw new apollo_server_core_1.ApolloError('Not found: Post', '409');
                }
                let { idLikes } = existedPost;
                if (idLikes.indexOf(currentUser._id) === -1) {
                    idLikes.push(currentUser._id);
                    yield typeorm_1.getMongoRepository(_models_1.PostEntity).updateOne({
                        _id: idPost
                    }, {
                        $set: {
                            idLikes
                        }
                    });
                    yield this.dashboardService.dashboardUpdated(pubsub);
                    return true;
                }
                else {
                    idLikes.splice(idLikes.indexOf(currentUser._id), 1);
                    yield typeorm_1.getMongoRepository(_models_1.PostEntity).updateOne({
                        _id: idPost
                    }, {
                        $set: {
                            idLikes
                        }
                    });
                    yield this.dashboardService.dashboardUpdated(pubsub);
                    return false;
                }
            }
            catch (error) {
                throw new apollo_server_core_1.ApolloError(error);
            }
        });
    }
    commentOnPost(currentUser, idPost, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existedPost = yield typeorm_1.getMongoRepository(_models_1.PostEntity).findOne({
                    _id: idPost
                });
                if (!existedPost) {
                    throw new apollo_server_core_1.ApolloError('Not fount: Post', '404');
                }
                const newComment = yield typeorm_1.getMongoRepository(_models_1.CommentEntity).save(new _models_1.CommentEntity(Object.assign(Object.assign({}, input), { idCreator: currentUser._id })));
                const { idComments } = existedPost;
                idComments.push(newComment._id);
                yield typeorm_1.getMongoRepository(_models_1.PostEntity).updateOne({
                    _id: idPost
                }, {
                    $set: {
                        idComments
                    }
                });
                return newComment;
            }
            catch (error) {
                throw new apollo_server_core_1.ApolloError(error);
            }
        });
    }
    deleteComment(idPost, idComment, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existedPost = yield typeorm_1.getMongoRepository(_models_1.PostEntity).findOne({
                    _id: idPost
                });
                const existedComment = yield typeorm_1.getMongoRepository(_models_1.CommentEntity).findOne({
                    _id: idComment
                });
                if (!existedPost) {
                    throw new apollo_server_core_1.ApolloError('Not found: Post', '404');
                }
                if (!existedComment) {
                    throw new apollo_server_core_1.ApolloError('Not found: Comment', '404');
                }
                if (existedComment.idCreator !== currentUser._id) {
                    throw new apollo_server_core_1.ApolloError('Cant delete comment', '403');
                }
                const { idComments } = existedPost;
                idComments.splice(idComments.indexOf(existedComment._id), 1);
                yield typeorm_1.getMongoRepository(_models_1.PostEntity).updateOne({
                    _id: idPost
                }, {
                    $set: {
                        idComments
                    }
                });
                const deleteComment = yield typeorm_1.getMongoRepository(_models_1.CommentEntity).deleteOne({
                    _id: idComment
                });
                return deleteComment.deletedCount > 0;
            }
            catch (error) {
                throw new apollo_server_core_1.ApolloError(error);
            }
        });
    }
    updateComment(idComment, input, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existedComment = yield typeorm_1.getMongoRepository(_models_1.CommentEntity).findOne({
                    _id: idComment
                });
                if (!existedComment) {
                    throw new apollo_server_core_1.ApolloError('Not found: Comment', '404');
                }
                if (existedComment.idCreator !== currentUser._id) {
                    throw new apollo_server_core_1.ApolloError('Cant update comment', '403');
                }
                yield typeorm_1.getMongoRepository(_models_1.CommentEntity).updateOne({
                    _id: idComment
                }, {
                    $set: Object.assign({}, input)
                });
                return yield typeorm_1.getMongoRepository(_models_1.CommentEntity).findOne({
                    _id: idComment
                });
            }
            catch (error) {
                throw new apollo_server_core_1.ApolloError(error);
            }
        });
    }
    toggleLikeComment(idComment, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existedComment = yield typeorm_1.getMongoRepository(_models_1.CommentEntity).findOne({
                    _id: idComment
                });
                if (!existedComment) {
                    throw new apollo_server_core_1.ApolloError('Not found: Comment', '409');
                }
                let { idLikes } = existedComment;
                if (idLikes.indexOf(currentUser._id) === -1) {
                    idLikes.push(currentUser._id);
                    yield typeorm_1.getMongoRepository(_models_1.CommentEntity).updateOne({
                        _id: idComment
                    }, {
                        $set: {
                            idLikes
                        }
                    });
                    return true;
                }
                else {
                    idLikes.splice(idLikes.indexOf(currentUser._id), 1);
                    yield typeorm_1.getMongoRepository(_models_1.CommentEntity).updateOne({
                        _id: idComment
                    }, {
                        $set: {
                            idLikes
                        }
                    });
                    return false;
                }
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
], PostResolver.prototype, "getPosts", null);
__decorate([
    graphql_1.Mutation(),
    __param(0, graphql_1.Context('pubsub')), __param(1, graphql_1.Context('currentUser')), __param(2, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, _models_1.UserEntity, graphql_schema_1.PostInput]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createNewPost", null);
__decorate([
    graphql_1.Mutation(),
    __param(0, graphql_1.Context('pubsub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deleteAllPost", null);
__decorate([
    graphql_1.Mutation(),
    __param(0, graphql_1.Context('pubsub')), __param(1, graphql_1.Args('idPost')), __param(2, graphql_1.Context('currentUser')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, _models_1.UserEntity]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
__decorate([
    graphql_1.Mutation(),
    __param(0, graphql_1.Context('currentUser')), __param(1, graphql_1.Args('input')), __param(2, graphql_1.Args('idPost')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_models_1.UserEntity, graphql_schema_1.PostInput, String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    graphql_1.Mutation(),
    __param(0, graphql_1.Context('currentUser')), __param(1, graphql_1.Args('idPost')), __param(2, graphql_1.Context('pubsub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_models_1.UserEntity, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "toggleLikePost", null);
__decorate([
    graphql_1.Mutation(),
    __param(0, graphql_1.Context('currentUser')), __param(1, graphql_1.Args('idPost')), __param(2, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_models_1.UserEntity, String, graphql_schema_1.CommentInput]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "commentOnPost", null);
__decorate([
    graphql_1.Mutation(),
    __param(0, graphql_1.Args('idPost')), __param(1, graphql_1.Args('idComment')), __param(2, graphql_1.Context('currentUser')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, _models_1.UserEntity]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deleteComment", null);
__decorate([
    graphql_1.Mutation(),
    __param(0, graphql_1.Args('idComment')), __param(1, graphql_1.Args('input')), __param(2, graphql_1.Context('currentUser')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, graphql_schema_1.CommentInput, _models_1.UserEntity]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updateComment", null);
__decorate([
    graphql_1.Mutation(),
    __param(0, graphql_1.Args('idComment')), __param(1, graphql_1.Context('currentUser')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, _models_1.UserEntity]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "toggleLikeComment", null);
PostResolver = __decorate([
    graphql_1.Resolver(),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=post.resolver.js.map