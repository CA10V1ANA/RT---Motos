"use client";
import { useEffect, useState } from "react";
import { lerFoto } from "./photos";

type FotoResolvida = {
  origem: string;
  url?: string;
};

export function useEstadoFoto(src?: string) {
  const [resolvida, setResolvida] = useState<{
    origem: string;
    url?: string;
  } | null>(null);

  useEffect(() => {
    if (!src?.startsWith("idb:")) return;
    let ativa = true;
    let url: string | undefined;

    void lerFoto(src)
      .then((blob) => {
        if (!ativa) return;
        url = blob ? URL.createObjectURL(blob) : undefined;
        setResolvida({ origem: src, url });
      })
      .catch(() => {
        if (ativa) setResolvida({ origem: src });
      });

    return () => {
      ativa = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [src]);

  if (!src?.startsWith("idb:")) {
    return { url: src, carregando: false };
  }

  const pronta = (resolvida as FotoResolvida | null)?.origem === src;
  return {
    url: pronta ? resolvida?.url : undefined,
    carregando: !pronta,
  };
}

export function useFoto(src?: string) {
  return useEstadoFoto(src).url;
}
