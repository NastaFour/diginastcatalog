import { createUploadthing, type FileRouter } from "uploadthing/next";

// ============================================================
// UploadThing route — subida de imágenes
// Max 4MB, solo imágenes (jpeg, png, webp, gif)
// ============================================================

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.url, key: file.key, name: file.name };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
