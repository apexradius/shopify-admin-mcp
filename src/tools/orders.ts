import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ShopifyClient } from "../shopify/client.js";
import { DEFAULT_LIMIT, formatResponse } from "../utils.js";

interface OrdersResponse {
  orders: unknown[];
}
interface OrderResponse {
  order: Record<string, unknown>;
}

export function registerOrderTools(server: McpServer, client: ShopifyClient): void {
  server.tool(
    "shopify_list_orders",
    "List orders from the Shopify store with optional filters.",
    {
      limit: z.number().min(1).max(250).optional().describe("Number of orders to return (max 250, default 50)"),
      status: z.enum(["open", "closed", "cancelled", "any"]).optional().describe("Filter by order status (default: open)"),
      financial_status: z.enum([
        "pending", "authorized", "partially_paid", "paid",
        "partially_refunded", "refunded", "voided", "any",
      ]).optional().describe("Filter by financial status"),
      fulfillment_status: z.enum([
        "shipped", "partial", "unshipped", "any", "unfulfilled",
      ]).optional().describe("Filter by fulfillment status"),
      since_id: z.string().optional().describe("Return orders after this ID"),
      created_at_min: z.string().optional().describe("Return orders created after this date (ISO 8601)"),
      created_at_max: z.string().optional().describe("Return orders created before this date (ISO 8601)"),
      fields: z.string().optional().describe("Comma-separated list of fields to return"),
    },
    async (args) => {
      const qs = client.buildQueryString({
        limit: args.limit ?? DEFAULT_LIMIT,
        status: args.status ?? "any",
        financial_status: args.financial_status,
        fulfillment_status: args.fulfillment_status,
        since_id: args.since_id,
        created_at_min: args.created_at_min,
        created_at_max: args.created_at_max,
        fields: args.fields,
      });
      const data = await client.rest<OrdersResponse>("GET", `/orders.json${qs}`);
      return formatResponse(data.orders);
    }
  );

  server.tool(
    "shopify_get_order",
    "Get a single order by ID.",
    {
      order_id: z.string().describe("The Shopify order ID"),
      fields: z.string().optional().describe("Comma-separated list of fields to return"),
    },
    async (args) => {
      const qs = client.buildQueryString({ fields: args.fields });
      const data = await client.rest<OrderResponse>("GET", `/orders/${args.order_id}.json${qs}`);
      return formatResponse(data.order);
    }
  );

  server.tool(
    "shopify_update_order",
    "Update an order's note, tags, or email.",
    {
      order_id: z.string().describe("The Shopify order ID"),
      note: z.string().optional().describe("Internal order note"),
      tags: z.string().optional().describe("Comma-separated tags"),
      email: z.string().optional().describe("Customer email for the order"),
    },
    async (args) => {
      const { order_id, ...fields } = args;
      const data = await client.rest<OrderResponse>("PUT", `/orders/${order_id}.json`, {
        order: { id: order_id, ...fields },
      });
      return formatResponse(data.order);
    }
  );

  server.tool(
    "shopify_cancel_order",
    "Cancel an order.",
    {
      order_id: z.string().describe("The Shopify order ID"),
      reason: z.enum(["customer", "fraud", "inventory", "declined", "other"]).optional().describe("Cancellation reason"),
      email: z.boolean().optional().describe("Whether to send a cancellation email to the customer"),
      refund: z.boolean().optional().describe("Whether to refund the order"),
    },
    async (args) => {
      const { order_id, ...params } = args;
      const data = await client.rest<OrderResponse>("POST", `/orders/${order_id}/cancel.json`, params);
      return formatResponse(data.order);
    }
  );

  server.tool(
    "shopify_count_orders",
    "Get the total count of orders.",
    {
      status: z.enum(["open", "closed", "cancelled", "any"]).optional().describe("Filter by status"),
    },
    async (args) => {
      const qs = client.buildQueryString({ status: args.status ?? "any" });
      const data = await client.rest<{ count: number }>("GET", `/orders/count.json${qs}`);
      return formatResponse({ count: data.count });
    }
  );
}
