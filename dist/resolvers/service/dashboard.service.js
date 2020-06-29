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
const typeorm_1 = require("typeorm");
const moment = require("moment");
const _models_1 = require("@models");
class DashboardService {
    dashboardUpdated(pubsub) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield typeorm_1.getMongoRepository(_models_1.UserEntity).find({});
            const posts = yield typeorm_1.getMongoRepository(_models_1.PostEntity).find({});
            const usersHash = {};
            users.map(item => {
                usersHash[item._id] = item;
            });
            const topUsersId = posts.reduce((obj, value) => {
                if (obj[value.idCreator]) {
                    obj[value.idCreator]++;
                }
                else {
                    obj[value.idCreator] = 1;
                }
                return obj;
            }, {});
            let maxValue = 0;
            let topUserId;
            Object.keys(topUsersId).forEach(key => {
                if (topUsersId[key] >= maxValue) {
                    topUserId = key;
                }
                maxValue = topUsersId[key];
            });
            const topPost = posts.length > 0 ? posts === null || posts === void 0 ? void 0 : posts.sort((a, b) => {
                return (b === null || b === void 0 ? void 0 : b.idLikes.length) - (a === null || a === void 0 ? void 0 : a.idLikes.length);
            })[0] : {};
            const today = [moment().startOf('days').valueOf(), moment().valueOf()];
            const last1Day = [moment().subtract(1, 'days').startOf('days').valueOf(), moment().subtract(1, 'days').endOf('days').valueOf()];
            const last2Day = [moment().subtract(2, 'days').startOf('days').valueOf(), moment().subtract(2, 'days').endOf('days').valueOf()];
            const last3Day = [moment().subtract(3, 'days').startOf('days').valueOf(), moment().subtract(3, 'days').endOf('days').valueOf()];
            const last4Day = [moment().subtract(4, 'days').startOf('days').valueOf(), moment().subtract(4, 'days').endOf('days').valueOf()];
            const last5Day = [moment().subtract(5, 'days').startOf('days').valueOf(), moment().subtract(5, 'days').endOf('days').valueOf()];
            const last6Day = [moment().subtract(6, 'days').startOf('days').valueOf(), moment().subtract(6, 'days').endOf('days').valueOf()];
            const postsInWeek = [0, 0, 0, 0, 0, 0, 0];
            posts.map(item => {
                if (item.createdAt >= today[0] && item.createdAt <= today[1]) {
                    postsInWeek[0]++;
                }
                if (item.createdAt >= last1Day[0] && item.createdAt <= last1Day[1]) {
                    postsInWeek[1]++;
                }
                if (item.createdAt >= last2Day[0] && item.createdAt <= last2Day[1]) {
                    postsInWeek[2]++;
                }
                if (item.createdAt >= last3Day[0] && item.createdAt <= last3Day[1]) {
                    postsInWeek[3]++;
                }
                if (item.createdAt >= last4Day[0] && item.createdAt <= last4Day[1]) {
                    postsInWeek[4]++;
                }
                if (item.createdAt >= last5Day[0] && item.createdAt <= last5Day[1]) {
                    postsInWeek[5]++;
                }
                if (item.createdAt >= last6Day[0] && item.createdAt <= last6Day[1]) {
                    postsInWeek[6]++;
                }
            });
            pubsub.publish('dashboardUpdated', {
                dashboardUpdated: {
                    numberOfUsers: users.length,
                    numberOfPosts: posts.length,
                    topUser: usersHash[topUserId],
                    topPost,
                    postsInWeek
                }
            });
        });
    }
}
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map