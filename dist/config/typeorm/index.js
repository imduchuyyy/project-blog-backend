"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const _environments_1 = require("@environments");
const config = {
    url: _environments_1.MLAB_URL
};
exports.TypeOrmService = {
    database: 'Blog',
    url: _environments_1.MLAB_URL,
    entities: typeorm_1.getMetadataArgsStorage().tables.map(tbl => tbl.target),
    synchronize: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
//# sourceMappingURL=index.js.map