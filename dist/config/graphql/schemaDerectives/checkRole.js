"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const graphql_1 = require("graphql");
class CheckRoleDirective extends apollo_server_express_1.SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const { resolve = graphql_1.defaultFieldResolver } = field;
        const { roles } = this.args;
        field.resolve = function (...args) {
            const { currentUser } = args[2];
            if (!currentUser) {
                throw new apollo_server_express_1.AuthenticationError('You don`t have permission');
            }
            const { role } = currentUser;
            if (roles.indexOf(role) === -1) {
                throw new apollo_server_express_1.AuthenticationError('You don`t have permission');
            }
            return resolve.apply(this, args);
        };
    }
}
exports.default = CheckRoleDirective;
//# sourceMappingURL=checkRole.js.map