import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ShopifyClient } from "../shopify/client.js";

interface CollectionsResponse {
  custom_collections?: unknown[];
  smart_collections?: unknown[];
}
interface CollectionResponse {
  custom_collection?: Record<string, unknown>;
  smart_collection?: Record<string, unknown>;
}

export function registerCollectionTools(server: McpServer, client: ShopifyClient): void {
  server.tool(
    "shopify_list_collections",
    "List all collections (both custom and smart collections) from the Shopify store.",
    {
      limit: z.number().min(1).max(250).optional().describe("Number of collections to return per type (default 50)"),
      title: z.string().optional().describe("Filter by title"),
      fields: z.string().optional().describe("Comma-separated list of fields to return"),
    },
    async (args) => {
      const qs = client.buildQueryString({
        limit: args.limit ?? 50,
        title: args.title,
        fields: args.fields,
      });
      const [custom, smart] = await Promise.all([
        client.rest<CollectionsResponse>("GET", `/custom_collections.json${qs}`),
        client.rest<CollectionsResponse>("GET", `/smart_collections.json${qs}`),
      ]);
      const result = {
        custom_collections: custom.custom_collections ?? [],
        smart_collections: smart.smart_collections ?? [],
      };
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "shopify_get_collection",
    "Get a custom collection by ID.",
    {
      collection_id: z.string().describe("The Shopify collection ID"),
      type: z.enum(["custom", "smart"]).optional().describe("Collection type (default: custom)"),
    },
    async (args) => {
      const type = args.type ?? "custom";
      const endpoint = type === "smart"
        ? `/smart_collections/${args.collection_id}.json`
        : `/custom_collections/${args.collection_id}.json`;
      const data = await client.rest<CollectionResponse>("GET", endpoint);
      const collection = data.custom_collection ?? data.smart_collection;
      return {
        content: [{ type: "text", text: JSON.stringify(collection, null, 2) }],
      };
    }
  );

  server.tool(
    "shopify_list_collection_products",
    "List products in a specific collection.",
    {
      collection_id: z.string().describe("The Shopify collection ID"),
      limit: z.number().min(1).max(250).optional().describe("Number of products to return (default 50)"),
      fields: z.string().optional().describe("Comma-separated list of fields to return"),
    },
    async (args) => {
      const qs = client.buildQueryString({
        collection_id: args.collection_id,
        limit: args.limit ?? 50,
        fields: args.fields,
      });
      const data = await client.rest<{ products: unknown[] }>("GET", `/products.json${qs}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data.products, null, 2) }],
      };
    }
  );
}
