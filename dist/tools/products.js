import { z } from "zod";
import { DEFAULT_LIMIT, formatResponse } from "../utils.js";
export function registerProductTools(server, client) {
    server.tool("shopify_list_products", "List products from the Shopify store with optional filters.", {
        limit: z.number().min(1).max(250).optional().describe("Number of products to return (max 250, default 50)"),
        status: z.enum(["active", "archived", "draft"]).optional().describe("Filter by product status"),
        vendor: z.string().optional().describe("Filter by vendor name"),
        product_type: z.string().optional().describe("Filter by product type"),
        title: z.string().optional().describe("Filter by title (partial match)"),
        since_id: z.string().optional().describe("Return products after this ID"),
        fields: z.string().optional().describe("Comma-separated list of fields to return"),
    }, async (args) => {
        const qs = client.buildQueryString({
            limit: args.limit ?? DEFAULT_LIMIT,
            status: args.status,
            vendor: args.vendor,
            product_type: args.product_type,
            title: args.title,
            since_id: args.since_id,
            fields: args.fields,
        });
        const data = await client.rest("GET", `/products.json${qs}`);
        return formatResponse(data.products);
    });
    server.tool("shopify_get_product", "Get a single product by ID.", {
        product_id: z.string().describe("The Shopify product ID"),
        fields: z.string().optional().describe("Comma-separated list of fields to return"),
    }, async (args) => {
        const qs = client.buildQueryString({ fields: args.fields });
        const data = await client.rest("GET", `/products/${args.product_id}.json${qs}`);
        return formatResponse(data.product);
    });
    server.tool("shopify_create_product", "Create a new product in the Shopify store.", {
        title: z.string().describe("Product title"),
        body_html: z.string().optional().describe("Product description (HTML)"),
        vendor: z.string().optional().describe("Product vendor"),
        product_type: z.string().optional().describe("Product type"),
        status: z.enum(["active", "archived", "draft"]).optional().describe("Product status (default: draft)"),
        tags: z.string().optional().describe("Comma-separated tags"),
        variants: z.array(z.object({
            price: z.string().describe("Variant price"),
            sku: z.string().optional(),
            inventory_quantity: z.number().optional(),
            option1: z.string().optional(),
            option2: z.string().optional(),
            option3: z.string().optional(),
        })).max(100).optional().describe("Product variants (max 100)"),
        options: z.array(z.object({
            name: z.string(),
            values: z.array(z.string()),
        })).max(3).optional().describe("Product options (max 3, matching Shopify limit)"),
        images: z.array(z.object({
            src: z.string().describe("Image URL"),
            alt: z.string().optional(),
        })).max(250).optional().describe("Product images (max 250)"),
    }, async (args) => {
        const { title, status, ...rest } = args;
        const data = await client.rest("POST", "/products.json", {
            product: { title, status: status ?? "draft", ...rest },
        });
        return formatResponse(data.product);
    });
    server.tool("shopify_update_product", "Update an existing product.", {
        product_id: z.string().describe("The Shopify product ID"),
        title: z.string().optional().describe("New product title"),
        body_html: z.string().optional().describe("New product description (HTML)"),
        vendor: z.string().optional().describe("New vendor"),
        product_type: z.string().optional().describe("New product type"),
        status: z.enum(["active", "archived", "draft"]).optional().describe("New status"),
        tags: z.string().optional().describe("New comma-separated tags"),
    }, async (args) => {
        const { product_id, ...fields } = args;
        const data = await client.rest("PUT", `/products/${product_id}.json`, {
            product: { id: product_id, ...fields },
        });
        return formatResponse(data.product);
    });
    server.tool("shopify_count_products", "Get the total count of products, optionally filtered by status.", {
        status: z.enum(["active", "archived", "draft"]).optional().describe("Filter by status"),
    }, async (args) => {
        const qs = client.buildQueryString({ status: args.status });
        const data = await client.rest("GET", `/products/count.json${qs}`);
        return formatResponse({ count: data.count });
    });
}
//# sourceMappingURL=products.js.map