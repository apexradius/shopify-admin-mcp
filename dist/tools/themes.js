import { z } from "zod";
import { formatResponse } from "../utils.js";
export function registerThemeTools(server, client) {
    server.tool("shopify_list_themes", "List all themes in the Shopify store.", {}, async () => {
        const data = await client.rest("GET", "/themes.json");
        return formatResponse(data.themes);
    });
    server.tool("shopify_get_theme", "Get a theme by ID.", {
        theme_id: z.string().describe("The Shopify theme ID"),
    }, async (args) => {
        const data = await client.rest("GET", `/themes/${args.theme_id}.json`);
        return formatResponse(data.theme);
    });
    server.tool("shopify_list_theme_assets", "List all asset keys in a theme.", {
        theme_id: z.string().describe("The Shopify theme ID"),
    }, async (args) => {
        const data = await client.rest("GET", `/themes/${args.theme_id}/assets.json`);
        return formatResponse(data.assets);
    });
    server.tool("shopify_get_theme_asset", "Get the content of a specific theme asset (template, CSS, JS, etc.).", {
        theme_id: z.string().describe("The Shopify theme ID"),
        asset_key: z.string().describe("The asset key (e.g. 'templates/index.liquid', 'assets/app.css')"),
    }, async (args) => {
        const qs = client.buildQueryString({ "asset[key]": args.asset_key });
        const data = await client.rest("GET", `/themes/${args.theme_id}/assets.json${qs}`);
        return formatResponse(data.asset);
    });
    server.tool("shopify_update_theme_asset", "Update or create a theme asset (write file content to a theme).", {
        theme_id: z.string().describe("The Shopify theme ID"),
        asset_key: z.string().describe("The asset key (e.g. 'templates/index.liquid')"),
        value: z.string().describe("The file content to write"),
    }, async (args) => {
        const data = await client.rest("PUT", `/themes/${args.theme_id}/assets.json`, {
            asset: { key: args.asset_key, value: args.value },
        });
        return formatResponse(data.asset);
    });
}
//# sourceMappingURL=themes.js.map