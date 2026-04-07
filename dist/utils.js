export const DEFAULT_LIMIT = 50;
export function formatResponse(data) {
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
}
//# sourceMappingURL=utils.js.map