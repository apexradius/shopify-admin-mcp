# @apexradius/shopify-mcp

> **Excellence in every detail.**

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for Shopify — giving Claude and other AI assistants direct, structured access to your store's data.

## Features

| Category | Tools |
|---|---|
| **Shop** | Get store info |
| **Products** | List, get, create, update, count |
| **Orders** | List, get, update, cancel, count |
| **Customers** | List, get, search, count |
| **Collections** | List, get, list products in collection |
| **Metafields** | List, set, delete (for any resource) |
| **Themes** | List, get, list/get/update assets |
| **GraphQL** | Raw GraphQL query/mutation passthrough |

## Requirements

- Node.js 18+
- A Shopify store with an Admin API access token

## Installation

```bash
npm install -g @apexradius/shopify-mcp
```

Or run directly with npx:

```bash
npx @apexradius/shopify-mcp
```

## Configuration

The server is configured via environment variables:

| Variable | Required | Description |
|---|---|---|
| `SHOPIFY_SHOP_DOMAIN` | Yes | Your store domain (e.g. `my-store.myshopify.com`) |
| `SHOPIFY_ACCESS_TOKEN` | Yes | Admin API access token |
| `SHOPIFY_API_VERSION` | No | API version (default: `2025-01`) |

### Getting your access token

1. Go to your Shopify Admin → **Settings** → **Apps and sales channels**
2. Click **Develop apps** → **Create an app**
3. Under **Configuration**, grant the API scopes you need
4. Under **API credentials**, install the app and copy the **Admin API access token**

**Recommended scopes:** `read_products`, `write_products`, `read_orders`, `write_orders`, `read_customers`, `read_inventory`, `read_themes`, `write_themes`, `read_metaobjects`, `write_metaobjects`

## Claude Desktop / Claude Code Setup

Add to your `~/.mcp.json` or Claude Desktop config:

```json
{
  "mcpServers": {
    "shopify": {
      "command": "npx",
      "args": ["-y", "@apexradius/shopify-mcp"],
      "env": {
        "SHOPIFY_SHOP_DOMAIN": "your-store.myshopify.com",
        "SHOPIFY_ACCESS_TOKEN": "shpat_xxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

## Available Tools

### Shop
- `shopify_get_shop` — Get store info (name, email, currency, timezone, plan)

### Products
- `shopify_list_products` — List products with filters (status, vendor, type, title)
- `shopify_get_product` — Get product by ID
- `shopify_create_product` — Create a new product
- `shopify_update_product` — Update title, description, status, tags, vendor
- `shopify_count_products` — Get total product count

### Orders
- `shopify_list_orders` — List orders with filters (status, financial, fulfillment, date range)
- `shopify_get_order` — Get order by ID
- `shopify_update_order` — Update note, tags, email
- `shopify_cancel_order` — Cancel an order
- `shopify_count_orders` — Get total order count

### Customers
- `shopify_list_customers` — List customers
- `shopify_get_customer` — Get customer by ID
- `shopify_search_customers` — Search by name, email, phone
- `shopify_count_customers` — Get total customer count

### Collections
- `shopify_list_collections` — List all custom + smart collections
- `shopify_get_collection` — Get collection by ID
- `shopify_list_collection_products` — List products in a collection

### Metafields
- `shopify_list_metafields` — List metafields for any resource
- `shopify_set_metafield` — Create or update a metafield
- `shopify_delete_metafield` — Delete a metafield by ID

### Themes
- `shopify_list_themes` — List all themes
- `shopify_get_theme` — Get theme by ID
- `shopify_list_theme_assets` — List all asset keys in a theme
- `shopify_get_theme_asset` — Get file content of a theme asset
- `shopify_update_theme_asset` — Write content to a theme file

### GraphQL
- `shopify_graphql` — Execute any GraphQL query or mutation

## License

MIT © [Apex Radius](https://apexradiuslabs.com)
