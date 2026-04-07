# Changelog

All notable changes to `@apexradius/shopify-mcp` are documented here.

## [1.0.0] — 2026-04-07

### Added
- Initial release of the Shopify MCP server
- **22 tools** across 8 categories:
  - **Shop**: `shopify_get_shop`
  - **Products**: `shopify_list_products`, `shopify_get_product`, `shopify_create_product`, `shopify_update_product`, `shopify_count_products`
  - **Orders**: `shopify_list_orders`, `shopify_get_order`, `shopify_update_order`, `shopify_cancel_order`, `shopify_count_orders`
  - **Customers**: `shopify_list_customers`, `shopify_get_customer`, `shopify_search_customers`, `shopify_count_customers`
  - **Collections**: `shopify_list_collections`, `shopify_get_collection`, `shopify_list_collection_products`
  - **Metafields**: `shopify_list_metafields`, `shopify_set_metafield`, `shopify_delete_metafield`
  - **Themes**: `shopify_list_themes`, `shopify_get_theme`, `shopify_list_theme_assets`, `shopify_get_theme_asset`, `shopify_update_theme_asset`
  - **GraphQL**: `shopify_graphql` (raw Admin API passthrough)
- Dual transport: Shopify REST Admin API + GraphQL Admin API
- 30-second request timeout on all API calls
- Input validation via Zod on all tool parameters
- TypeScript strict mode throughout
