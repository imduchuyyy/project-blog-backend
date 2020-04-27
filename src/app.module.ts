import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { resolve, join } from 'path';

import {
  getMetadataArgsStorage,
} from 'typeorm'

import {
  MLAB_URL,
} from '@environments'

import { GraphqlService, TypeOrmService } from '@config';
import * as Resolvers from './resolvers'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    GraphQLModule.forRootAsync({
      useClass: GraphqlService
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
    ...Object.values(Resolvers)
  ],
})
export class AppModule { }
