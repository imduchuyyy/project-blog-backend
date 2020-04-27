import {
  SchemaDirectiveVisitor,
  AuthenticationError
} from 'apollo-server-express'
import { defaultFieldResolver } from 'graphql'

class CheckRoleDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    const { roles } = this.args

    field.resolve = function (...args) {
      const { currentUser } = args[2]

      if (!currentUser) {
        throw new AuthenticationError(
          'You don`t have permission'
        )
      }

      const { role } = currentUser

      if (roles.indexOf(role) === -1) {
        throw new AuthenticationError(
          'You don`t have permission'
        )
      }

      return resolve.apply(this, args)
    }
  }
}

export default CheckRoleDirective
