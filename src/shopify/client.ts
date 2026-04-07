export interface ShopifyConfig {
  shopDomain: string;
  accessToken: string;
  apiVersion: string;
}

interface ShopifyError {
  message: string;
  errors?: Record<string, string[]> | string[];
}

export class ShopifyClient {
  private config: ShopifyConfig;

  constructor(config: ShopifyConfig) {
    this.config = config;
  }

  private get baseUrl(): string {
    return `https://${this.config.shopDomain}/admin/api/${this.config.apiVersion}`;
  }

  private get headers(): Record<string, string> {
    return {
      "X-Shopify-Access-Token": this.config.accessToken,
      "Content-Type": "application/json",
    };
  }

  async rest<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Shopify API error ${response.status}: ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText) as ShopifyError;
        if (errorJson.errors) {
          errorMessage = `Shopify API error ${response.status}: ${JSON.stringify(errorJson.errors)}`;
        }
      } catch {
        // ignore parse error, use default message
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  async graphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const url = `${this.baseUrl}/graphql.json`;
    const response = await fetch(url, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      throw new Error(`Shopify GraphQL error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json() as { data?: T; errors?: Array<{ message: string }> };

    if (result.errors && result.errors.length > 0) {
      throw new Error(`GraphQL errors: ${result.errors.map((e) => e.message).join(", ")}`);
    }

    return result.data as T;
  }

  buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
    const parts: string[] = [];
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        parts.push(`${key}=${encodeURIComponent(String(value))}`);
      }
    }
    return parts.length > 0 ? `?${parts.join("&")}` : "";
  }
}

export function createClient(): ShopifyClient {
  const shopDomain = process.env.SHOPIFY_SHOP_DOMAIN;
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  const apiVersion = process.env.SHOPIFY_API_VERSION ?? "2025-01";

  if (!shopDomain) throw new Error("SHOPIFY_SHOP_DOMAIN environment variable is required");
  if (!accessToken) throw new Error("SHOPIFY_ACCESS_TOKEN environment variable is required");

  return new ShopifyClient({ shopDomain, accessToken, apiVersion });
}
