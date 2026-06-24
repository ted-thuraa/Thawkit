import { genUploader } from "uploadthing/client";
// You would define your FileRouter type in your project
// import type { OurFileRouter } from "@/app/api/uploadthing/core";

// --- Types ---

export type UploadResult = {
  url: string;
  storageProvider: string;
  filename: string;
  size: number;
  mimeType: string;
  key?: string; // specific for deletion references (e.g. S3 key or UT file key)
};

export interface StorageAdapter {
  upload(
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<UploadResult>;
  delete(urlOrKey: string): Promise<void>;
}

// --- 1. UploadThing Implementation (Specific to your context) ---

// NOTE: This assumes you have an endpoint defined in your UploadThing router named 'mediaUploader'
// If you don't have the types set up globally, we cast to any for this adapter example.
const { uploadFiles } = genUploader<any>();

export class UploadThingAdapter implements StorageAdapter {
  async upload(
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<UploadResult> {
    // UploadThing handles progress internally differently, but we can simulate or hook if using custom components.
    // For this adapter wrapper, we rely on the promise resolution.

    try {
      const res = await uploadFiles("mediaUploader", {
        files: [file],
        onUploadProgress: ({ progress }) => {
          if (onProgress) onProgress(progress);
        },
      });

      const uploaded = res[0];

      return {
        url: uploaded.url,
        storageProvider: "uploadthing",
        filename: uploaded.name,
        size: uploaded.size,
        mimeType: file.type,
        key: uploaded.key,
      };
    } catch (error) {
      console.error("UploadThing Error:", error);
      throw new Error("Upload failed via UploadThing");
    }
  }

  async delete(fileKey: string): Promise<void> {
    // UploadThing deletion usually happens via a server-side API route (UTAPI).
    // The client adapter here would call your own API endpoint which wraps UTAPI.deleteFiles(key).
    // We will assume the general /api/media/[id] endpoint handles the server-side deletion logic.
    return Promise.resolve();
  }
}

// --- 2. Uploadcare Implementation (REST API Example) ---

export class UploadcareAdapter implements StorageAdapter {
  private publicKey: string;

  constructor(publicKey: string) {
    this.publicKey = publicKey;
  }

  async upload(
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<UploadResult> {
    const formData = new FormData();
    formData.append("UPLOADCARE_PUB_KEY", this.publicKey);
    formData.append("UPLOADCARE_STORE", "1"); // Auto-store
    formData.append("file", file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://upload.uploadcare.com/base/");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress((event.loaded / event.total) * 100);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          // Uploadcare returns a UUID. The URL is CDN + UUID.
          const uuid = response.file;
          const cdnUrl = `https://ucarecdn.com/${uuid}/`;

          resolve({
            url: cdnUrl,
            storageProvider: "uploadcare",
            filename: response.original_filename,
            size: response.size,
            mimeType: response.mime_type,
            key: uuid,
          });
        } else {
          reject(new Error("Uploadcare upload failed"));
        }
      };

      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.send(formData);
    });
  }

  async delete(uuid: string): Promise<void> {
    // Client-side deletion is unsafe/restricted in Uploadcare.
    // This method is a stub; actual deletion must happen server-side with the Private Key.
    return Promise.resolve();
  }
}

// --- 3. DigitalOcean / S3 Stub ---

export class S3Adapter implements StorageAdapter {
  async upload(
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<UploadResult> {
    // 1. Request signed URL from your API
    // 2. PUT file to signed URL
    // 3. Return public URL
    console.log("Simulating S3 upload for", file.name);
    if (onProgress) onProgress(50);
    return {
      url: "https://spaces_url/file.jpg",
      storageProvider: "digitalocean",
      filename: file.name,
      size: file.size,
      mimeType: file.type,
      key: "file.jpg",
    };
  }
  async delete(key: string): Promise<void> {
    return Promise.resolve();
  }
}

// --- Factory ---

export function getStorageAdapter(): StorageAdapter {
  const provider = process.env.NEXT_PUBLIC_STORAGE_PROVIDER || "uploadthing"; // Defaulting to your context

  switch (provider) {
    case "uploadthing":
      return new UploadThingAdapter();
    case "uploadcare":
      const key = process.env.NEXT_PUBLIC_UPLOADCARE_KEY;
      if (!key) throw new Error("Missing NEXT_PUBLIC_UPLOADCARE_KEY");
      return new UploadcareAdapter(key);
    case "digitalocean":
      return new S3Adapter();
    default:
      throw new Error(`Unknown storage provider: ${provider}`);
  }
}
