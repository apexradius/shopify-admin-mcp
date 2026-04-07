import { z } from "zod";
import { DEFAULT_LIMIT, formatResponse } from "../utils.js";
export function registerCustomerTools(server, client) {
    server.tool("shopify_list_customers", "List customers from the Shopify store.", {
        limit: z.number().min(1).max(250).optional().describe("Number of customers to return (max 250, default 50)"),
        since_id: z.string().optional().describe("Return customers after this ID"),
        created_at_min: z.string().optional().describe("Return customers created after this date (ISO 8601)"),
        created_at_max: z.string().optional().describe("Return customers created before this date (ISO 8601)"),
        fields: z.string().optional().describe("Comma-separated list of fields to return"),
    }, async (args) => {
        const qs = client.buildQueryString({
            limit: args.limit ?? DEFAULT_LIMIT,
            since_id: args.since_id,
            created_at_min: args.created_at_min,
            created_at_max: args.created_at_max,
            fields: args.fields,
        });
        const data = await client.rest("GET", `/customers.json${qs}`);
        return formatResponse(data.customers);
    });
    server.tool("shopify_get_customer", "Get a single customer by ID.", {
        customer_id: z.string().describe("The Shopify customer ID"),
        fields: z.string().optional().describe("Comma-separated list of fields to return"),
    }, async (args) => {
        const qs = client.buildQueryString({ fields: args.fields });
        const data = await client.rest("GET", `/customers/${args.customer_id}.json${qs}`);
        return formatResponse(data.customer);
    });
    server.tool("shopify_search_customers", "Search customers by name, email, phone, or other fields.", {
        query: z.string().min(1).describe("Search query (e.g. 'email:test@example.com' or 'John')"),
        limit: z.number().min(1).max(250).optional().describe("Number of results to return (default 50)"),
        fields: z.string().optional().describe("Comma-separated list of fields to return"),
    }, async (args) => {
        const qs = client.buildQueryString({
            query: args.query,
            limit: args.limit ?? DEFAULT_LIMIT,
            fields: args.fields,
        });
        const data = await client.rest("GET", `/customers/search.json${qs}`);
        return formatResponse(data.customers);
    });
    server.tool("shopify_count_customers", "Get the total count of customers.", {}, async () => {
        const data = await client.rest("GET", "/customers/count.json");
        return formatResponse({ count: data.count });
    });
}
//# sourceMappingURL=customers.js.map