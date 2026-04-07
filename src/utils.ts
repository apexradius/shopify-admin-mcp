export const DEFAULT_LIMIT = 50;

export function formatResponse(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}
