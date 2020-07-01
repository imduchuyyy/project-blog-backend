"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const _config_1 = require("./config");
const typeorm_1 = require("typeorm");
const helmet = require("helmet");
const chalk = require("chalk");
const _environments_1 = require("./environments");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const app = yield core_1.NestFactory.create(app_module_1.AppModule, {});
            const { isConnected } = typeorm_1.getConnection('default');
            isConnected ? common_1.Logger.log('Database connected', 'TypeORM', false)
                : common_1.Logger.error('Connect to database error', '', 'TypeORM', false);
            app.use(helmet());
            app.enableShutdownHooks();
            app.useGlobalInterceptors(new _config_1.LoggingInterceptor());
            const server = yield app.listen(_environments_1.PORT);
            if (module.hot) {
                module.hot.accept();
                module.hot.dispose(() => app.close());
            }
            _environments_1.NODE_ENV !== 'production'
                ? common_1.Logger.log(`🚀  Server ready at http://${_environments_1.DOMAIN}:${chalk
                    .hex(_environments_1.PRIMARY_COLOR)
                    .bold(`${_environments_1.PORT}`)}/${_environments_1.END_POINT}`, 'Bootstrap', false)
                : common_1.Logger.log(`🚀  Server is listening on port ${chalk
                    .hex(_environments_1.PRIMARY_COLOR)
                    .bold(`${_environments_1.PORT}`)}`, 'Bootstrap', false);
            _environments_1.NODE_ENV !== 'production' &&
                common_1.Logger.log(`🚀  Subscriptions ready at ws://${_environments_1.DOMAIN}:${chalk
                    .hex(_environments_1.PRIMARY_COLOR)
                    .bold(`${_environments_1.PORT}`)}/${_environments_1.END_POINT}`, 'Bootstrap', false);
        }
        catch (error) {
            common_1.Logger.error(`❌  Error starting server, ${error}`, '', 'Bootstrap', false);
            process.exit();
        }
    });
}
bootstrap().catch(e => {
    common_1.Logger.error(`❌  Error starting server, ${e}`, '', 'Bootstrap', false);
    throw e;
});
//# sourceMappingURL=main.js.map