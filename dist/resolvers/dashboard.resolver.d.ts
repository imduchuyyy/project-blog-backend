import { DashboardData } from './../generator/graphql.schema';
import { DashboardService } from './service/dashboard.service';
export declare class DashboardResolver {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    dashboardUpdate(pubsub: any): any;
    dashboardData(): Promise<DashboardData>;
    deleteAllMember(pubsub: any): Promise<boolean>;
    deleteAllAdmin(pubsub: any): Promise<boolean>;
}
