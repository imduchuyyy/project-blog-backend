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
var PostEntity_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const uuid = require("uuid");
const class_transformer_1 = require("class-transformer");
let PostEntity = PostEntity_1 = class PostEntity {
    constructor(post) {
        if (post) {
            Object.assign(this, class_transformer_1.plainToClass(PostEntity_1, post, {
                excludeExtraneousValues: true
            }));
            this._id = this._id || uuid.v1();
            this.idComments = [];
            this.idLikes = [];
            this.createdAt = this.createdAt || +new Date();
        }
    }
};
__decorate([
    class_transformer_1.Expose(),
    typeorm_1.ObjectIdColumn(),
    __metadata("design:type", String)
], PostEntity.prototype, "_id", void 0);
__decorate([
    class_transformer_1.Expose(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], PostEntity.prototype, "idCreator", void 0);
__decorate([
    class_transformer_1.Expose(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], PostEntity.prototype, "description", void 0);
__decorate([
    class_transformer_1.Expose(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], PostEntity.prototype, "thumbnails", void 0);
__decorate([
    class_transformer_1.Expose(),
    typeorm_1.Column(),
    __metadata("design:type", Array)
], PostEntity.prototype, "idLikes", void 0);
__decorate([
    class_transformer_1.Expose(),
    typeorm_1.Column(),
    __metadata("design:type", Array)
], PostEntity.prototype, "idComments", void 0);
__decorate([
    class_transformer_1.Expose(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], PostEntity.prototype, "createdAt", void 0);
PostEntity = PostEntity_1 = __decorate([
    typeorm_1.Entity({
        name: 'posts'
    }),
    __metadata("design:paramtypes", [Object])
], PostEntity);
exports.PostEntity = PostEntity;
//# sourceMappingURL=post.entity.js.map