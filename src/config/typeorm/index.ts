import { Injectable } from '@nestjs/common'
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm'
import {
  getMetadataArgsStorage,
  createConnection,
  getConnection
} from 'typeorm'

import {
  MLAB_DATABASE,
  MLAB_URL,
} from '@environments'

const config = {
  url: MLAB_URL
}

// @Injectable()
// export class TypeOrmService implements TypeOrmOptionsFactory {
//   async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
//     const options = {
//       ...config,
//       // type: 'mongodb',
//       entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
//       // migrations: ['src/modules/**/migration/*.ts'],
//       // subscribers: ['src/modules/**/subscriber/*.ts'],
//       // cli: {
//       // 	entitiesDir: 'src/modules/**/entity',
//       // 	migrationsDir: 'src/modules/**/migration',
//       // 	subscribersDir: 'src/modules/**/subscriber'
//       // },
//       synchronize: true,
//       autoLoadEntities: true,
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       keepConnectionAlive: true,
//       logging: true
//     }
//     return options
//   }
// }

export const TypeOrmService = {
  // type: 'mongodb',
  database: 'Blog',
  url: MLAB_URL,
  entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
  synchronize: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
