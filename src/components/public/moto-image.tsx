"use client";
import Image from "next/image";
import { useState } from "react";
import { ImageOff, LoaderCircle } from "lucide-react";
import { useEstadoFoto } from "@/lib/data/use-photo";
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
  const { url: resolvida, carregando } = useEstadoFoto(src);
  const [falhas, setFalhas] = useState<string[]>([]);
  const url = [resolvida, fallbackSrc].find(
    (candidata): candidata is string =>
      Boolean(candidata) && !falhas.includes(candidata as string),
  );
  const isSvg = url?.endsWith(".svg");

  if (!url && carregando) {
    return (
      <div className="image-empty" role="status">
        <LoaderCircle className="image-loader" size={28} />
        <span>Carregando foto…</span>
      </div>
    );
  }

  return url ? (
    <Image
      src={url}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() =>
        setFalhas((atuais) =>
          atuais.includes(url) ? atuais : [...atuais, url],
        )
      }
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
  ) : (
    <div className="image-empty">
      <ImageOff size={32} />
      <span>Foto indisponível</span>
    </div>
  );
}
