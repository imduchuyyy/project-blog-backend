"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const chalk = require("chalk");
const _environments_1 = require("@environments");
class MyLogger {
    log(message) { }
    error(message, trace) { }
    warn(message) { }
    debug(message) { }
    verbose(message) { }
}
exports.MyLogger = MyLogger;
let LoggingInterceptor = class LoggingInterceptor {
    intercept(context, next) {
        if (context.getArgs()[3]) {
            const parentType = context.getArgs()[3]['parentType'];
            const fieldName = chalk
                .hex(_environments_1.PRIMARY_COLOR)
                .bold(`${context.getArgs()[3]['fieldName']}`);
            return next.handle().pipe(operators_1.tap(() => {
                common_1.Logger.debug(`⛩  ${parentType} » ${fieldName}`, 'GraphQL');
            }));
        }
        else {
            const parentType = chalk
                .hex(_environments_1.PRIMARY_COLOR)
                .bold(`${context.getArgs()[0].route.path}`);
            const fieldName = chalk
                .hex(_environments_1.PRIMARY_COLOR)
                .bold(`${context.getArgs()[0].route.stack[0].method}`);
            return next.handle().pipe(operators_1.tap(() => {
                common_1.Logger.debug(`⛩  ${parentType} » ${fieldName}`, 'GraphQL');
            }));
        }
    }
};
LoggingInterceptor = __decorate([
    common_1.Injectable()
], LoggingInterceptor);
exports.LoggingInterceptor = LoggingInterceptor;
//# sourceMappingURL=index.js.map