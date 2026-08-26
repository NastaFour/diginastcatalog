import { createRouteHandler } from "uploadthing/next";
import { uploadRouter } from "@/lib/uploadthing/core";

const handlers = createRouteHandler({
  router: uploadRouter,
  config: {
    logLevel: "Error",
  },
});

export const { GET, POST } = handlers;
