import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ShopifyClient } from "../shopify/client.js";

interface MetafieldsResponse {
  metafields: unknown[];
}
interface MetafieldResponse {
  metafield: Record<string, unknown>;
}

const ownerResourceEnum = z.enum([
  "product", "variant", "order", "customer", "collection", "shop", "blog", "page", "article",
]);

export function registerMetafieldTools(server: McpServer, client: ShopifyClient): void {
  server.tool(
    "shopify_list_metafields",
    "List metafields for a resource (product, order, customer, etc.).",
    {
      owner_resource: ownerResourceEnum.describe("The type of resource"),
      owner_id: z.string().optional().describe("The ID of the resource (omit for shop-level metafields)"),
      namespace: z.string().optional().describe("Filter by namespace"),
      key: z.string().optional().describe("Filter by key"),
      limit: z.number().min(1).max(250).optional().describe("Number of metafields to return (default 50)"),
    },
    async (args) => {
      let path: string;
      if (args.owner_resource === "shop") {
        path = "/metafields.json";
      } else if (args.owner_id) {
        path = `/${args.owner_resource}s/${args.owner_id}/metafields.json`;
      } else {
        throw new Error("owner_id is required for non-shop resources");
      }

      const qs = client.buildQueryString({
        namespace: args.namespace,
        key: args.key,
        limit: args.limit ?? 50,
      });
      const data = await client.rest<MetafieldsResponse>("GET", `${path}${qs}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data.metafields, null, 2) }],
      };
    }
  );

  server.tool(
    "shopify_set_metafield",
    "Create or update a metafield on a resource.",
    {
      owner_resource: ownerResourceEnum.describe("The type of resource"),
      owner_id: z.string().optional().describe("The ID of the resource (omit for shop-level metafields)"),
      namespace: z.string().describe("Metafield namespace"),
      key: z.string().describe("Metafield key"),
      value: z.string().describe("Metafield value"),
      type: z.string().describe("Metafield type (e.g. single_line_text_field, integer, json, boolean, url, color, date, date_time, dimension, rating, volume, weight, money)"),
    },
    async (args) => {
      let path: string;
      if (args.owner_resource === "shop") {
        path = "/metafields.json";
      } else if (args.owner_id) {
        path = `/${args.owner_resource}s/${args.owner_id}/metafields.json`;
      } else {
        throw new Error("owner_id is required for non-shop resources");
      }

      const data = await client.rest<MetafieldResponse>("POST", path, {
        metafield: {
          namespace: args.namespace,
          key: args.key,
          value: args.value,
          type: args.type,
        },
      });
      return {
        content: [{ type: "text", text: JSON.stringify(data.metafield, null, 2) }],
      };
    }
  );

  server.tool(
    "shopify_delete_metafield",
    "Delete a metafield by ID.",
    {
      metafield_id: z.string().describe("The metafield ID to delete"),
    },
    async (args) => {
      await client.rest("DELETE", `/metafields/${args.metafield_id}.json`);
      return {
        content: [{ type: "text", text: `Metafield ${args.metafield_id} deleted successfully.` }],
      };
    }
  );
}
