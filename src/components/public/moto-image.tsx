"use client";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function MotoImage({
  src,
  alt,
  priority = false,
  sizes = "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw",
  contain = false,
  className,
  fallbackSrc,
}: {
  src?: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  contain?: boolean;
  className?: string;
  fallbackSrc?: string;
}) {
  const url = src || fallbackSrc;

  if (!url) {
    return (
      <div className="image-empty">
        <ImageOff size={32} />
        <span>Foto indisponível</span>
      </div>
    );
  }

  const isSvg = url.endsWith(".svg");

  return (
    <Image
      src={url}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={url.startsWith("blob:") || isSvg}
      className={cn(
        contain
          ? "object-contain"
          : isSvg
            ? "object-cover object-center"
            : "object-cover object-[50%_68%]",
        className,
      )}
    />
  );
}
