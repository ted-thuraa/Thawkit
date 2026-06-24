"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IoIosImages } from "react-icons/io";

import { CloudUpload, FileIcon, FolderSearch, Loader2Icon } from "lucide-react";
import useSWR, { mutate } from "swr";
import { DialogProvider } from "@/providers/dialog-provider";
import { Button } from "../ui/button";
import DialogWrapper from "@/wrappers/dialog-wrapper";
import UploadMediaForm from "../forms/upload-media";
import MediaCard from "./mediaCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStorageAdapter } from "@/lib/storageAdapters";
import { toast } from "sonner";

// --- Types (Mirroring API Response) ---

interface MediaItem {
  id: string;
  url: string;
  name: string;
  mimeType?: string;
  size?: number;
  createdAt: string;
  storageProvider?: string;
}

type FetchResponse = {
  items: MediaItem[];
  nextCursor?: number; // For infinite scroll simplified
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Props = {
  projectId: string;
  organizationId: string;
  onChange: (url?: string) => void;
  allowedTypes?: string[]; // e.g., ["image/*", "application/pdf"]
  maxSizeMB?: number;
};

const MediaComponent = ({
  projectId,
  organizationId,
  onChange,
  allowedTypes = ["image/*", "video/*", "application/pdf"],
  maxSizeMB = 25,
}: Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const PAGE_LIMIT = 50; // Simple pagination for now

  // --- Data Fetching ---
  const { data, error, isLoading } = useSWR<{ items: MediaItem[] }>(
    `/api/media?projectId=${projectId}&organizationId=${organizationId}&limit=${PAGE_LIMIT}`,
    fetcher
  );

  const mediaItems = data?.items || [];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validation
    setUploadError(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setUploadError(`File too large. Max size is ${maxSizeMB}MB.`);
      return;
    }

    // Simple wildcard check
    const isAllowed = allowedTypes.some((type) => {
      if (type.endsWith("/*"))
        return file.type.startsWith(type.replace("/*", ""));
      return file.type === type;
    });

    if (!isAllowed) {
      setUploadError("File type not supported.");
      return;
    }

    // 2. Upload Process
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const adapter = getStorageAdapter();
      const result = await adapter.upload(file, (percent) =>
        setUploadProgress(percent)
      );

      // 3. Save to DB
      const dbRes = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          organizationId,
          url: result.url,
          filename: result.filename,
          size: result.size,
          mime_type: result.mimeType,
          storage_provider: result.storageProvider,
        }),
      });

      if (!dbRes.ok) throw new Error("Failed to save media record");

      // 4. Update UI
      await mutate(
        `/api/media?projectId=${projectId}&organizationId=${organizationId}&limit=${PAGE_LIMIT}`
      ); // Refresh list
      setUploadProgress(0);

      // Auto-select new item
      const newItem = await dbRes.json();
      setSelectedId(newItem.id);
      onChange(newItem.url);
    } catch (err) {
      console.error(err);
      setUploadError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    }
  };

  const handleDelete = async (e: React.MouseEvent, item: MediaItem) => {
    e.stopPropagation(); // Prevent selection when clicking delete
    if (
      !confirm(
        "Are you sure you want to delete this file? This cannot be undone."
      )
    )
      return;

    setDeletingId(item.id);

    try {
      const res = await fetch(`/api/media/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      // Optimistic update could go here, but re-fetching is safer for sync
      await mutate(
        `/api/media?projectId=${projectId}&organizationId=${organizationId}&limit=${PAGE_LIMIT}`
      );

      if (selectedId === item.id) {
        setSelectedId(null);
        onChange(undefined);
      }
    } catch (err) {
      alert("Could not delete file.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSelect = (item: MediaItem) => {
    if (selectedId === item.id) {
      // Deselect logic if desired, or keep generic
      // setSelectedId(null);
      // onChange(undefined);
    } else {
      setSelectedId(item.id);
      onChange(item.url);
    }
  };

  {
    uploadError && toast.error("Failed to upload");
  }

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <Command className="bg-transparent">
        <CommandInput placeholder="Search for file name..." />

        <CommandList className="pb-40 max-h-full">
          {/* <CommandEmpty>No Media Files</CommandEmpty> */}

          <CommandGroup heading="Media Files">
            {isLoading ? (
              <div className="flex flex-row flex-wrap gap-1 pt-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded-md animate-pulse"
                  />
                ))}
              </div>
            ) : mediaItems.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <IoIosImages />
                  </EmptyMedia>
                  <EmptyTitle>No Media Files</EmptyTitle>
                  <EmptyDescription>Upload to get started.</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      aria-label="Upload new file"
                    >
                      <CloudUpload className="opacity-72" />
                      Upload
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept={allowedTypes.join(",")}
                      onChange={handleFileSelect}
                    />
                  </div>
                </EmptyContent>
              </Empty>
            ) : (
              <div className="flex flex-row flex-wrap gap-1 pt-4">
                {/* Always render the upload button */}
                <CommandItem
                  key="upload-item"
                  className="p-0 max-w-[200px] w-full rounded-lg"
                >
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    aria-label="Upload new file"
                    variant="ghost"
                    className="rounded-lg p-0 w-full flex flex-col items-center justify-center hover:bg-gray-100 hover:text-editor-foreground"
                  >
                    {isUploading ? (
                      <Loader2Icon className="w-6 h-6 text-indigo-600 animate-spin" />
                    ) : (
                      <CloudUpload className="w-6 h-6" />
                    )}

                    <p>Upload file</p>
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept={allowedTypes.join(",")}
                    onChange={handleFileSelect}
                  />
                </CommandItem>

                {/* Conditionally render the list of files */}
                {mediaItems.map((item) => {
                  const isSelected = selectedId === item.id;
                  const isDeleting = deletingId === item.id;
                  // const isImage =
                  //   item.mimeType?.startsWith("image/") ||
                  //   item.url.match(/\.(jpeg|jpg|gif|png|webp)$/i);

                  return (
                    <CommandItem
                      key={item.id}
                      value={item.url}
                      onSelect={() => handleSelect(item)}
                      className="relative p-0 max-w-[200px] w-full rounded-lg !bg-transparent !font-medium !text-white"
                    >
                      <MediaCard item={item} />
                    </CommandItem>
                  );
                })}
              </div>
            )}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default MediaComponent;
