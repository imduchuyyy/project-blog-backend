"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("./auth");
const checkRole_1 = require("./checkRole");
exports.default = {
    isAuthenticated: auth_1.default,
    checkRoles: checkRole_1.default
};
//# sourceMappingURL=index.js.map