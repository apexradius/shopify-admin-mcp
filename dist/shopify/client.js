export class ShopifyClient {
    config;
    constructor(config) {
        this.config = config;
    }
    get baseUrl() {
        return `https://${this.config.shopDomain}/admin/api/${this.config.apiVersion}`;
    }
    get headers() {
        return {
            "X-Shopify-Access-Token": this.config.accessToken,
            "Content-Type": "application/json",
        };
    }
    async rest(method, path, body) {
        const url = `${this.baseUrl}${path}`;
        const response = await fetch(url, {
            method,
            headers: this.headers,
            body: body ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `Shopify API error ${response.status}: ${response.statusText}`;
            try {
                const errorJson = JSON.parse(errorText);
                if (errorJson.errors) {
                    errorMessage = `Shopify API error ${response.status}: ${JSON.stringify(errorJson.errors)}`;
                }
            }
            catch {
                // ignore parse error, use default message
            }
            throw new Error(errorMessage);
        }
        if (response.status === 204) {
            return {};
        }
        return response.json();
    }
    async graphql(query, variables) {
        const url = `${this.baseUrl}/graphql.json`;
        const response = await fetch(url, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({ query, variables }),
        });
        if (!response.ok) {
            throw new Error(`Shopify GraphQL error ${response.status}: ${response.statusText}`);
        }
        const result = await response.json();
        if (result.errors && result.errors.length > 0) {
            throw new Error(`GraphQL errors: ${result.errors.map((e) => e.message).join(", ")}`);
        }
        return result.data;
    }
    buildQueryString(params) {
        const parts = [];
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null && value !== "") {
                parts.push(`${key}=${encodeURIComponent(String(value))}`);
            }
        }
        return parts.length > 0 ? `?${parts.join("&")}` : "";
    }
}
export function createClient() {
    const shopDomain = process.env.SHOPIFY_SHOP_DOMAIN;
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    const apiVersion = process.env.SHOPIFY_API_VERSION ?? "2025-01";
    if (!shopDomain)
        throw new Error("SHOPIFY_SHOP_DOMAIN environment variable is required");
    if (!accessToken)
        throw new Error("SHOPIFY_ACCESS_TOKEN environment variable is required");
    return new ShopifyClient({ shopDomain, accessToken, apiVersion });
}
//# sourceMappingURL=client.js.map