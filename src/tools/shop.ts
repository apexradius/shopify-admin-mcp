import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ShopifyClient } from "../shopify/client.js";

interface ShopResponse {
  shop: Record<string, unknown>;
}

export function registerShopTools(server: McpServer, client: ShopifyClient): void {
  server.tool(
    "shopify_get_shop",
    "Get information about the Shopify store including name, email, currency, timezone, plan, and domain.",
    {},
    async () => {
      const data = await client.rest<ShopResponse>("GET", "/shop.json");
      return {
        content: [{ type: "text", text: JSON.stringify(data.shop, null, 2) }],
      };
    }
  );
}
