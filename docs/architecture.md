# Architecture

`shopify-admin-mcp` is a TypeScript MCP server that maps tool calls onto Shopify Admin REST and
GraphQL operations.

## Components

```mermaid
flowchart TD
    Entry[src/index.ts] --> Env[Environment config]
    Entry --> Tools[src/tools]
    Entry --> Shared["@apexradius/apex-mcp-shared"]
    Tools --> Products[products.ts]
    Tools --> Orders[orders.ts]
    Tools --> Customers[customers.ts]
    Tools --> Collections[collections.ts]
    Tools --> Metafields[metafields.ts]
    Tools --> Themes[themes.ts]
    Tools --> GraphQL[graphql.ts]
    Products --> Client[src/shopify/client.ts]
    Orders --> Client
    Customers --> Client
    Collections --> Client
    Metafields --> Client
    Themes --> Client
    GraphQL --> Client
    Client --> Shopify[Shopify Admin API]
```

## Request Sequence

```mermaid
sequenceDiagram
    actor User
    participant MCP as MCP client
    participant Server as src/index.ts
    participant Tool as src/tools/*
    participant Client as shopify/client.ts
    participant Shopify as Shopify Admin API

    User->>MCP: Ask for store action
    MCP->>Server: Call Shopify tool
    Server->>Tool: Validate tool input
    Tool->>Client: Build Admin API request
    Client->>Shopify: REST or GraphQL call
    Shopify-->>Client: API response
    Client-->>Tool: Parsed data
    Tool-->>Server: Tool result
    Server-->>MCP: MCP response
```

## Data Boundaries

| Data | Source | Storage |
|---|---|---|
| Store domain | `SHOPIFY_SHOP_DOMAIN` | Environment only. |
| Admin token | `SHOPIFY_ACCESS_TOKEN` | Environment only. |
| API version | `SHOPIFY_API_VERSION` | Environment, defaulted by code. |
| Store data | Shopify Admin API | Returned through MCP; not persisted here. |

## Extension Points

| Change | File |
|---|---|
| Add a tool group | `src/tools/<group>.ts` |
| Change API transport | `src/shopify/client.ts` |
| Register new tools | `src/index.ts` |
| Change package build/lint | `package.json`, `biome.json`, `tsconfig.json` |
