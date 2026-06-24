import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import React from "react";

// Create some dummy initial files
const initialFiles = [
  {
    name: "intro.zip",
    size: 252873,
    type: "application/zip",
    url: "https://example.com/intro.zip",
    id: "intro.zip-1744638436563-8u5xuls",
  },
  {
    name: "image-01.jpg",
    size: 1528737,
    type: "image/jpeg",
    url: "https://picsum.photos/1000/800?grayscale&random=1",
    id: "image-01-123456789",
  },
  {
    name: "audio.mp3",
    size: 1528737,
    type: "audio/mpeg",
    url: "https://example.com/audio.mp3",
    id: "audio-123456789",
  },
];
const ImageButtonComponent = () => {
  const getFilePreview = (file: {
    file: File | { type: string; name: string; url?: string };
  }) => {
    const fileType =
      file.file instanceof File ? file.file.type : file.file.type;
    const fileName =
      file.file instanceof File ? file.file.name : file.file.name;

    const renderImage = (src: string) => (
      <img
        src={src}
        alt={fileName}
        className="size-full rounded-t-[inherit] object-cover"
      />
    );

    return (
      <div className="bg-accent flex aspect-square items-center justify-center overflow-hidden rounded-t-[inherit]">
        {fileType.startsWith("image/") ? (
          file.file instanceof File ? (
            (() => {
              const previewUrl = URL.createObjectURL(file.file);
              return renderImage(previewUrl);
            })()
          ) : file.file.url ? (
            renderImage(file.file.url)
          ) : (
            <ImageIcon className="size-5 opacity-60" />
          )
        ) : (
          <ImageIcon className="size-5 opacity-60" />
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {initialFiles.map((file) => (
          <div
            key={file.id}
            className="bg-background relative flex flex-col rounded-md border"
          >
            {getFilePreview({ file: file })}

            <div className="flex min-w-0 flex-col gap-0.5 border-t p-3">
              <p className="truncate text-[13px] font-medium">{file.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageButtonComponent;
