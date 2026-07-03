# Start Here

This package exposes Shopify Admin API operations through MCP. Use it when an AI assistant needs
structured access to products, orders, customers, collections, metafields, themes, or raw GraphQL.

## First Run

```bash
npm install
npm run build
npm run start
```

For normal use, install globally or run through `npx @apexradius/shopify-mcp`.

## Required Shopify Setup

1. Create a custom app in Shopify Admin.
2. Grant the API scopes needed for the tools you plan to use.
3. Install the app.
4. Put `SHOPIFY_SHOP_DOMAIN` and `SHOPIFY_ACCESS_TOKEN` in the MCP client environment.
5. Restart the MCP client and call `shopify_get_shop`.

## Development Loop

```bash
npm install
npm run lint
npm run build
```

Tool groups live under `src/tools/`; the Admin API wrapper lives in `src/shopify/client.ts`.
