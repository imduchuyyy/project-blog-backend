import { SchemaDirectiveVisitor } from 'apollo-server-express';
declare class AuthDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field: any): void;
}
export default AuthDirective;
