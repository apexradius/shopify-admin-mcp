import { z } from "zod";
import { DEFAULT_LIMIT, formatResponse } from "../utils.js";
const ownerResourceEnum = z.enum([
    "product", "variant", "order", "customer", "collection", "shop", "blog", "page", "article",
]);
function resolveMetafieldPath(ownerResource, ownerId) {
    if (ownerResource === "shop")
        return "/metafields.json";
    if (ownerId)
        return `/${ownerResource}s/${ownerId}/metafields.json`;
    throw new Error("owner_id is required for non-shop resources");
}
export function registerMetafieldTools(server, client) {
    server.tool("shopify_list_metafields", "List metafields for a resource (product, order, customer, etc.).", {
        owner_resource: ownerResourceEnum.describe("The type of resource"),
        owner_id: z.string().optional().describe("The ID of the resource (omit for shop-level metafields)"),
        namespace: z.string().optional().describe("Filter by namespace"),
        key: z.string().optional().describe("Filter by key"),
        limit: z.number().min(1).max(250).optional().describe("Number of metafields to return (default 50)"),
    }, async (args) => {
        const path = resolveMetafieldPath(args.owner_resource, args.owner_id);
        const qs = client.buildQueryString({
            namespace: args.namespace,
            key: args.key,
            limit: args.limit ?? DEFAULT_LIMIT,
        });
        const data = await client.rest("GET", `${path}${qs}`);
        return formatResponse(data.metafields);
    });
    server.tool("shopify_set_metafield", "Create or update a metafield on a resource.", {
        owner_resource: ownerResourceEnum.describe("The type of resource"),
        owner_id: z.string().optional().describe("The ID of the resource (omit for shop-level metafields)"),
        namespace: z.string().describe("Metafield namespace"),
        key: z.string().describe("Metafield key"),
        value: z.string().describe("Metafield value"),
        type: z.string().describe("Metafield type (e.g. single_line_text_field, integer, json, boolean, url, color, date, date_time, dimension, rating, volume, weight, money)"),
    }, async (args) => {
        const path = resolveMetafieldPath(args.owner_resource, args.owner_id);
        const data = await client.rest("POST", path, {
            metafield: {
                namespace: args.namespace,
                key: args.key,
                value: args.value,
                type: args.type,
            },
        });
        return formatResponse(data.metafield);
    });
    server.tool("shopify_delete_metafield", "Delete a metafield by ID.", {
        metafield_id: z.string().describe("The metafield ID to delete"),
    }, async (args) => {
        await client.rest("DELETE", `/metafields/${args.metafield_id}.json`);
        return formatResponse({ deleted: true, id: args.metafield_id });
    });
}
//# sourceMappingURL=metafields.js.map