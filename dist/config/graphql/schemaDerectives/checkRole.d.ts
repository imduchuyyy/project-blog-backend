import { SchemaDirectiveVisitor } from 'apollo-server-express';
declare class CheckRoleDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field: any): void;
}
export default CheckRoleDirective;
