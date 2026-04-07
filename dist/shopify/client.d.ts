export interface ShopifyConfig {
    shopDomain: string;
    accessToken: string;
    apiVersion: string;
}
export interface ShopifyError {
    message: string;
    errors?: Record<string, string[]> | string[];
}
export declare class ShopifyClient {
    private config;
    constructor(config: ShopifyConfig);
    private get baseUrl();
    private get headers();
    rest<T>(method: string, path: string, body?: unknown): Promise<T>;
    graphql<T>(query: string, variables?: Record<string, unknown>): Promise<T>;
    buildQueryString(params: Record<string, string | number | boolean | undefined>): string;
}
export declare function createClient(): ShopifyClient;
//# sourceMappingURL=client.d.ts.map