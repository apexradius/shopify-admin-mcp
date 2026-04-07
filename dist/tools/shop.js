export function registerShopTools(server, client) {
    server.tool("shopify_get_shop", "Get information about the Shopify store including name, email, currency, timezone, plan, and domain.", {}, async () => {
        const data = await client.rest("GET", "/shop.json");
        return {
            content: [{ type: "text", text: JSON.stringify(data.shop, null, 2) }],
        };
    });
}
//# sourceMappingURL=shop.js.map