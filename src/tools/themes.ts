import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ShopifyClient } from "../shopify/client.js";

interface ThemesResponse {
  themes: unknown[];
}
interface ThemeResponse {
  theme: Record<string, unknown>;
}
interface AssetsResponse {
  assets: unknown[];
}
interface AssetResponse {
  asset: Record<string, unknown>;
}

export function registerThemeTools(server: McpServer, client: ShopifyClient): void {
  server.tool(
    "shopify_list_themes",
    "List all themes in the Shopify store.",
    {},
    async () => {
      const data = await client.rest<ThemesResponse>("GET", "/themes.json");
      return {
        content: [{ type: "text", text: JSON.stringify(data.themes, null, 2) }],
      };
    }
  );

  server.tool(
    "shopify_get_theme",
    "Get a theme by ID.",
    {
      theme_id: z.string().describe("The Shopify theme ID"),
    },
    async (args) => {
      const data = await client.rest<ThemeResponse>("GET", `/themes/${args.theme_id}.json`);
      return {
        content: [{ type: "text", text: JSON.stringify(data.theme, null, 2) }],
      };
    }
  );

  server.tool(
    "shopify_list_theme_assets",
    "List all asset keys in a theme.",
    {
      theme_id: z.string().describe("The Shopify theme ID"),
    },
    async (args) => {
      const data = await client.rest<AssetsResponse>("GET", `/themes/${args.theme_id}/assets.json`);
      return {
        content: [{ type: "text", text: JSON.stringify(data.assets, null, 2) }],
      };
    }
  );

  server.tool(
    "shopify_get_theme_asset",
    "Get the content of a specific theme asset (template, CSS, JS, etc.).",
    {
      theme_id: z.string().describe("The Shopify theme ID"),
      asset_key: z.string().describe("The asset key (e.g. 'templates/index.liquid', 'assets/app.css')"),
    },
    async (args) => {
      const qs = client.buildQueryString({ "asset[key]": args.asset_key });
      const data = await client.rest<AssetResponse>("GET", `/themes/${args.theme_id}/assets.json${qs}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data.asset, null, 2) }],
      };
    }
  );

  server.tool(
    "shopify_update_theme_asset",
    "Update or create a theme asset (write file content to a theme).",
    {
      theme_id: z.string().describe("The Shopify theme ID"),
      asset_key: z.string().describe("The asset key (e.g. 'templates/index.liquid')"),
      value: z.string().describe("The file content to write"),
    },
    async (args) => {
      const data = await client.rest<AssetResponse>("PUT", `/themes/${args.theme_id}/assets.json`, {
        asset: {
          key: args.asset_key,
          value: args.value,
        },
      });
      return {
        content: [{ type: "text", text: JSON.stringify(data.asset, null, 2) }],
      };
    }
  );
}
