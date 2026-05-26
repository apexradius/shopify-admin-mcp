#!/usr/bin/env node
/**
 * @apexradius/shopify-mcp
 * A Model Context Protocol server for Shopify.
 *
 * Apex Radius — Excellence in every detail.
 *
 * Environment variables:
 *   SHOPIFY_SHOP_DOMAIN   — your-store.myshopify.com
 *   SHOPIFY_ACCESS_TOKEN  — Admin API access token
 *   SHOPIFY_API_VERSION   — (optional) API version, defaults to 2025-01
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createClient } from "./shopify/client.js";
import { registerCollectionTools } from "./tools/collections.js";
import { registerCustomerTools } from "./tools/customers.js";
import { registerGraphqlTools } from "./tools/graphql.js";
import { registerMetafieldTools } from "./tools/metafields.js";
import { registerOrderTools } from "./tools/orders.js";
import { registerProductTools } from "./tools/products.js";
import { registerShopTools } from "./tools/shop.js";
import { registerThemeTools } from "./tools/themes.js";

async function main() {
  let client;
  try {
    client = createClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`[shopify-mcp] Configuration error: ${message}\n`);
    process.exit(1);
  }

  const server = new McpServer({
    name: "@apexradius/shopify-mcp",
    version: "1.0.0",
  });

  registerShopTools(server, client);
  registerProductTools(server, client);
  registerOrderTools(server, client);
  registerCustomerTools(server, client);
  registerCollectionTools(server, client);
  registerMetafieldTools(server, client);
  registerThemeTools(server, client);
  registerGraphqlTools(server, client);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  process.stderr.write("[shopify-mcp] Server running on stdio\n");
}

main().catch((err) => {
  process.stderr.write(
    `[shopify-mcp] Fatal error: ${err instanceof Error ? err.message : String(err)}\n`,
  );
  process.exit(1);
});
