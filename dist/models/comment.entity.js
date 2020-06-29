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
var CommentEntity_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const uuid = require("uuid");
const class_transformer_1 = require("class-transformer");
let CommentEntity = CommentEntity_1 = class CommentEntity {
    constructor(comment) {
        if (comment) {
            Object.assign(this, class_transformer_1.plainToClass(CommentEntity_1, comment, {
                excludeExtraneousValues: true
            }));
            this._id = this._id || uuid.v1();
            this.idLikes = [];
            this.createdAt = this.createdAt || +new Date();
        }
    }
};
__decorate([
    class_transformer_1.Expose(),
    typeorm_1.ObjectIdColumn(),
    __metadata("design:type", String)
], CommentEntity.prototype, "_id", void 0);
__decorate([
    class_transformer_1.Expose(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], CommentEntity.prototype, "idCreator", void 0);
__decorate([
    class_transformer_1.Expose(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], CommentEntity.prototype, "description", void 0);
__decorate([
    class_transformer_1.Expose(),
    typeorm_1.Column(),
    __metadata("design:type", Array)
], CommentEntity.prototype, "idLikes", void 0);
__decorate([
    class_transformer_1.Expose(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], CommentEntity.prototype, "createdAt", void 0);
CommentEntity = CommentEntity_1 = __decorate([
    typeorm_1.Entity({
        name: 'comments'
    }),
    __metadata("design:paramtypes", [Object])
], CommentEntity);
exports.CommentEntity = CommentEntity;
//# sourceMappingURL=comment.entity.js.map