import { Module, CacheModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  getMetadataArgsStorage,
} from 'typeorm'

import {
  MLAB_URL,
} from './environments'

import { GraphqlService, TypeOrmService, CacheService } from '@config';
import * as Resolvers from './resolvers'
import * as Service from './resolvers/service'

@Module({
  imports: [
    // ScheduleModule.forRoot(),
    GraphQLModule.forRootAsync({
      useClass: GraphqlService
    }),
    CacheModule.registerAsync({
      useClass: CacheService
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      database: 'BlogDB',
      url: MLAB_URL,
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
      synchronize: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [],
  providers: [
    ...Object.values(Resolvers),
    ...Object.values(Service)
  ],
})
export class AppModule { }
