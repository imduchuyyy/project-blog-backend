"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const graphql_1 = require("graphql");
class AuthDirective extends apollo_server_express_1.SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const { resolve = graphql_1.defaultFieldResolver } = field;
        field.resolve = function (...args) {
            const { currentUser } = args[2];
            if (!currentUser) {
                throw new apollo_server_express_1.AuthenticationError('Authentication token is invalid, please try again.');
            }
            return resolve.apply(this, args);
        };
    }
}
exports.default = AuthDirective;
//# sourceMappingURL=auth.js.map