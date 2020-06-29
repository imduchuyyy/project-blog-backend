"use strict";
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
const jsonwebtoken_1 = require("jsonwebtoken");
const typeorm_1 = require("typeorm");
const apollo_server_core_1 = require("apollo-server-core");
const models_1 = require("./../../models");
const _environments_1 = require("@environments");
exports.generateToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return yield jsonwebtoken_1.sign({
        _id: user._id
    }, _environments_1.SECRET_KEY_TOKEN);
});
exports.verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let currentUser;
    yield jsonwebtoken_1.verify(token, _environments_1.SECRET_KEY_TOKEN, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            throw new apollo_server_core_1.AuthenticationError('Authentication token is invalid, please try again.');
        }
        currentUser = yield typeorm_1.getMongoRepository(models_1.UserEntity).findOne({
            _id: data._id
        });
    }));
    return currentUser;
});
//# sourceMappingURL=index.js.map