import { createUploadthing } from "uploadthing/server";
import { verifyJWT } from "./auth";

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB" },
  })
    .middleware(async ({ req }) => {
      // You can check admin here later

      const token = req.headers.get("Authorization");

      if (!token) throw new Error("Unauthorized");

      const decoded = await verifyJWT(token);

      if (!decoded) throw new Error("Unauthorized");

      return { userId: decoded.id };
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Uploaded file:", file.url);

      return {
        url: file.url,
      };
    }),
};

export type UploadRouter = typeof uploadRouter;