import assert from "node:assert/strict";
import { test } from "node:test";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ShopifyClient } from "../src/shopify/client.js";
import { registerCollectionTools } from "../src/tools/collections.js";
import { registerCustomerTools } from "../src/tools/customers.js";
import { registerGraphqlTools } from "../src/tools/graphql.js";
import { registerMetafieldTools } from "../src/tools/metafields.js";
import { registerOrderTools } from "../src/tools/orders.js";
import { registerProductTools } from "../src/tools/products.js";
import { registerShopTools } from "../src/tools/shop.js";
import { registerThemeTools } from "../src/tools/themes.js";

interface Registration {
  name: string;
  description: string;
  schema: unknown;
  handler: unknown;
}

const EXPECTED_TOOLS = [
  "shopify_cancel_order",
  "shopify_count_customers",
  "shopify_count_orders",
  "shopify_count_products",
  "shopify_create_product",
  "shopify_delete_metafield",
  "shopify_get_collection",
  "shopify_get_customer",
  "shopify_get_order",
  "shopify_get_product",
  "shopify_get_shop",
  "shopify_get_theme",
  "shopify_get_theme_asset",
  "shopify_graphql",
  "shopify_list_collection_products",
  "shopify_list_collections",
  "shopify_list_customers",
  "shopify_list_metafields",
  "shopify_list_orders",
  "shopify_list_products",
  "shopify_list_theme_assets",
  "shopify_list_themes",
  "shopify_search_customers",
  "shopify_set_metafield",
  "shopify_update_order",
  "shopify_update_product",
  "shopify_update_theme_asset",
].sort();

test("every tool registers with a name, description, schema, and handler", () => {
  const calls: Registration[] = [];
  const fakeServer = {
    tool(name: string, description: string, schema: unknown, handler: unknown) {
      calls.push({ name, description, schema, handler });
    },
  } as unknown as McpServer;
  const client = {} as ShopifyClient;

  registerShopTools(fakeServer, client);
  registerProductTools(fakeServer, client);
  registerOrderTools(fakeServer, client);
  registerCustomerTools(fakeServer, client);
  registerCollectionTools(fakeServer, client);
  registerMetafieldTools(fakeServer, client);
  registerThemeTools(fakeServer, client);
  registerGraphqlTools(fakeServer, client);

  assert.deepEqual(calls.map((c) => c.name).sort(), EXPECTED_TOOLS);

  for (const call of calls) {
    assert.equal(typeof call.name, "string", `${call.name} name`);
    assert.equal(typeof call.description, "string", `${call.name} description`);
    assert.ok(call.description.length > 0, `${call.name} description non-empty`);
    assert.equal(typeof call.schema, "object", `${call.name} schema shape`);
    assert.equal(typeof call.handler, "function", `${call.name} handler`);
  }
});
