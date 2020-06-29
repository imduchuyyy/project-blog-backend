import { GqlOptionsFactory, GqlModuleOptions } from "@nestjs/graphql";
export declare class GraphqlService implements GqlOptionsFactory {
    createGqlOptions(): Promise<GqlModuleOptions>;
}
