"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const _environments_1 = require("@environments");
const _config_1 = require("@config");
const Resolvers = require("./resolvers");
const Service = require("./resolvers/service");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            graphql_1.GraphQLModule.forRootAsync({
                useClass: _config_1.GraphqlService
            }),
            common_1.CacheModule.registerAsync({
                useClass: _config_1.CacheService
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mongodb',
                database: 'BlogDB',
                url: _environments_1.MLAB_URL,
                entities: typeorm_2.getMetadataArgsStorage().tables.map(tbl => tbl.target),
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
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map