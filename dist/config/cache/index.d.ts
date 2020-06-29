import { CacheOptionsFactory, CacheModuleOptions } from '@nestjs/common';
export declare class CacheService implements CacheOptionsFactory {
    createCacheOptions(): CacheModuleOptions;
}
