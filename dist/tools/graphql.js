import { z } from "zod";
import { formatResponse } from "../utils.js";
export function registerGraphqlTools(server, client) {
    server.tool("shopify_graphql", "Execute a raw GraphQL query or mutation against the Shopify Admin API. Use this for advanced queries not covered by the other tools.", {
        query: z.string().describe("The GraphQL query or mutation string"),
        variables: z.record(z.string(), z.unknown()).optional().describe("GraphQL variables as a JSON object"),
    }, async (args) => {
        const data = await client.graphql(args.query, args.variables);
        return formatResponse(data);
    });
}
//# sourceMappingURL=graphql.js.map