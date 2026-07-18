import type { VercelRequest, VercelResponse } from "@vercel/node";

let server: any;

async function getServer() {
  if (!server) {
    try {
      const mod = await import("../dist/server/server.js");
      server = mod.default || mod.fetch;
    } catch (error) {
      console.error("Failed to load server:", error);
      throw error;
    }
  }
  return server;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const fetch = await getServer();

    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    const request = new Request(url, {
      method: req.method,
      headers: req.headers as HeadersInit,
      body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
    });

    const response = await fetch(request);

    // Copy headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    res.status(response.status);
    res.send(await response.text());
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
