import assert from "node:assert/strict";
import { test } from "node:test";
import { createClient, ShopifyClient } from "../src/shopify/client.js";

const ENV_KEYS = ["SHOPIFY_SHOP_DOMAIN", "SHOPIFY_ACCESS_TOKEN", "SHOPIFY_API_VERSION"];

function snapshotEnv(): Record<string, string | undefined> {
  const saved: Record<string, string | undefined> = {};
  for (const key of ENV_KEYS) saved[key] = process.env[key];
  return saved;
}

function restoreEnv(saved: Record<string, string | undefined>): void {
  for (const key of ENV_KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
}

test("createClient throws a clean error when the shop domain is missing", () => {
  const saved = snapshotEnv();
  try {
    delete process.env.SHOPIFY_SHOP_DOMAIN;
    delete process.env.SHOPIFY_ACCESS_TOKEN;
    assert.throws(() => createClient(), /SHOPIFY_SHOP_DOMAIN/);
  } finally {
    restoreEnv(saved);
  }
});

test("createClient throws a clean error when the access token is missing", () => {
  const saved = snapshotEnv();
  try {
    process.env.SHOPIFY_SHOP_DOMAIN = "test.myshopify.com";
    delete process.env.SHOPIFY_ACCESS_TOKEN;
    assert.throws(() => createClient(), /SHOPIFY_ACCESS_TOKEN/);
  } finally {
    restoreEnv(saved);
  }
});

test("createClient returns a ShopifyClient when fully configured", () => {
  const saved = snapshotEnv();
  try {
    process.env.SHOPIFY_SHOP_DOMAIN = "test.myshopify.com";
    process.env.SHOPIFY_ACCESS_TOKEN = "shpat_test";
    assert.ok(createClient() instanceof ShopifyClient);
  } finally {
    restoreEnv(saved);
  }
});

test("buildQueryString skips empty values and URL-encodes the rest", () => {
  const client = new ShopifyClient({
    shopDomain: "test.myshopify.com",
    accessToken: "shpat_test",
    apiVersion: "2025-01",
  });
  assert.equal(client.buildQueryString({}), "");
  assert.equal(
    client.buildQueryString({ limit: 5, vendor: undefined, title: "", q: "a b" }),
    "?limit=5&q=a%20b",
  );
});
