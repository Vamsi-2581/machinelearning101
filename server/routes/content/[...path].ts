/**
 * Server route to serve content files (markdown and JSON)
 * Handles requests to /content/** paths
 */

import { readFile } from "fs/promises";
import { join } from "path";

export default defineEventHandler(async (event) => {
  const path = event.context.params?.path || "";

  // Security: prevent directory traversal
  if (path.includes("..")) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid path",
    });
  }

  try {
    // Construct the file path
    const filePath = join(process.cwd(), "content", path);

    // Read the file
    const content = await readFile(filePath, "utf-8");

    // Set appropriate content type based on file extension
    const contentType = path.endsWith(".json")
      ? "application/json"
      : path.endsWith(".md")
        ? "text/markdown"
        : "text/plain";

    event.node.res.setHeader("Content-Type", contentType);

    return content;
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: "Content not found",
    });
  }
});
