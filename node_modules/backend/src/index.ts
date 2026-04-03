import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./routers/_app";
import { createContext } from "./context";
import { cors } from "hono/cors";
import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "./lib/uploadthing";

export const app = new Hono();

// Middleware
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// tRPC
app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
  })
);

// UploadThing route
const handlers = createRouteHandler({ router: uploadRouter });
app.all("/api/uploadthing", (c) => handlers(c.req.raw));

// Serve static files (only in Bun environment)
if (typeof Bun !== "undefined") {
  const { serveStatic } = await import("hono/bun");
  
  // Serve admin static files
  app.use("/admin/*", serveStatic({ root: "../admin/dist" }));
  app.get("/admin/*", serveStatic({ path: "../admin/dist/index.html" }));

  // Serve frontend static files
  app.use("/*", serveStatic({ root: "../frontend/dist" }));
  app.get("/*", serveStatic({ path: "../frontend/dist/index.html" }));
}

app.get("/api/health", (c) => {
  return c.text("Backend is running!");
});

export default {
  port: 3000,
  fetch: app.fetch,
};
