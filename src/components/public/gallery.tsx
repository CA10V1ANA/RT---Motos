"use client";
import { useEffect, useState, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { motion } from "motion/react";
import type { MotoPublica } from "@/lib/data/schemas";
import { MotoImage } from "./moto-image";
import { Button } from "../ui/button";
import { useDialogFocus } from "../ui/use-dialog-focus";
export function Gallery({
  moto,
  preview = false,
}: {
  moto: MotoPublica;
  preview?: boolean;
}) {
  const focus = useDialogFocus();
  const [index, setIndex] = useState(0);
  const [raiox, setRaiox] = useState(false);
  const [point, setPoint] = useState<string | null>(null);
  const [full, setFull] = useState(false);
  const [zoom, setZoom] = useState(false);
  const start = useRef(0);
  const fullscreenPhoto = useRef<HTMLDivElement>(null);
  const foto = moto.fotos[index] ?? moto.fotos[0];
  const hotspot = moto.hotspots.find((p) => p.id === point);

  useEffect(() => {
    fullscreenPhoto.current?.scrollTo({ top: 0, left: 0 });
  }, [index, zoom]);

  const mover = (delta: number) => {
    setIndex(
      (i) => (i + delta + moto.fotos.length) % Math.max(1, moto.fotos.length),
    );
    setPoint(null);
    setZoom(false);
  };
  function selecionarPonto(id: string) {
    const p = moto.hotspots.find((h) => h.id === id);
    if (!p) return;
    setIndex(
      Math.max(
        0,
        moto.fotos.findIndex((f) => f.id === p.fotoId),
      ),
    );
    setPoint(id);
  }
  return (
    <div className="min-w-0 max-w-full">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="segments">
          <button aria-pressed={!raiox} onClick={() => setRaiox(false)}>
            Galeria HD
          </button>
          {moto.hotspots.length > 0 && (
            <button
              aria-pressed={raiox}
              onClick={() => {
                setRaiox(true);
                selecionarPonto(moto.hotspots[0].id);
              }}
            >
              Raio-X
            </button>
          )}
        </div>
        <span className="font-mono text-xs text-muted">
          {moto.fotos.length ? index + 1 : 0} / {moto.fotos.length}
        </span>
      </div>
      <motion.div
        layoutId={preview ? undefined : `foto-${moto.id}`}
        className="gallery-stage"
        onTouchStart={(e) => {
          start.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (Math.abs(e.changedTouches[0].clientX - start.current) > 45)
            mover(e.changedTouches[0].clientX < start.current ? 1 : -1);
        }}
      >
        <button
          className="gallery-photo-button"
          onClick={() => {
            if (!raiox && foto) setFull(true);
          }}
          aria-label="Abrir foto em tela cheia"
        >
          <MotoImage
            src={foto?.src}
            alt={`${moto.modelo} — ${foto?.legenda ?? "foto"}`}
            priority
            contain
            sizes="(min-width:1024px) 60vw, 100vw"
          />
        </button>
        {!raiox && (
          <span className="gallery-zoom">
            <ZoomIn size={16} />
            Ampliar
          </span>
        )}
        {raiox &&
          moto.hotspots
            .filter((p) => p.fotoId === foto?.id)
            .map((p) => (
              <button
                key={p.id}
                className="hotspot"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                onClick={() => setPoint(point === p.id ? null : p.id)}
                aria-label={p.titulo}
                aria-pressed={p.id === point}
              >
                <span />
              </button>
            ))}
        {raiox && hotspot && (
          <div className="hotspot-caption">
            <strong>{hotspot.titulo}</strong>
            <p>{hotspot.descricao}</p>
          </div>
        )}
      </motion.div>
      <div className="gallery-thumbs">
        {moto.fotos.map((f, i) => (
          <button
            key={f.id}
            className={i === index ? "selected" : ""}
            onClick={() => {
              setIndex(i);
              setPoint(null);
            }}
            aria-label={`Mostrar foto ${f.legenda ?? i + 1}`}
            aria-pressed={i === index}
          >
            <div>
              <MotoImage src={f.src} alt={f.legenda ?? "Miniatura"} />
            </div>
            <span>{f.legenda ?? `Foto ${i + 1}`}</span>
          </button>
        ))}
      </div>
      {raiox && (
        <div className="flex flex-wrap gap-2 mt-4">
          {moto.hotspots.map((p, i) => (
            <Button
              key={p.id}
              variant="secondary"
              onClick={() => selecionarPonto(p.id)}
              aria-pressed={point === p.id}
            >
              {i + 1}. {p.titulo}
            </Button>
          ))}
        </div>
      )}
      <Dialog.Root
        open={full}
        onOpenChange={(v) => {
          setFull(v);
          setZoom(false);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="fullscreen-gallery" {...focus}>
            <Dialog.Title className="sr-only">
              Fotos de {moto.modelo}
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Use as setas para navegar. A foto abre inteira; use o controle de
              zoom para examinar os detalhes.
            </Dialog.Description>
            <div
              ref={fullscreenPhoto}
              className="fullscreen-photo"
              onTouchStart={(e) => {
                start.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                if (
                  !zoom &&
                  Math.abs(e.changedTouches[0].clientX - start.current) > 45
                )
                  mover(e.changedTouches[0].clientX < start.current ? 1 : -1);
              }}
            >
              <div className={`fullscreen-image-frame${zoom ? " zoomed" : ""}`}>
                <MotoImage
                  src={foto?.src}
                  alt={`${moto.modelo} — ${foto?.legenda}`}
                  contain
                  sizes="100vw"
                />
              </div>
            </div>
            <div className="fullscreen-controls">
              <Button
                variant="secondary"
                aria-label="Foto anterior"
                onClick={() => mover(-1)}
              >
                <ChevronLeft />
              </Button>
              <span>
                {foto?.legenda} · {index + 1}/{moto.fotos.length}
              </span>
              <Button
                variant="secondary"
                aria-label="Próxima foto"
                onClick={() => mover(1)}
              >
                <ChevronRight />
              </Button>
              <Button
                className="fullscreen-zoom-control"
                variant="secondary"
                aria-pressed={zoom}
                onClick={() => setZoom((atual) => !atual)}
              >
                {zoom ? <ZoomOut /> : <ZoomIn />}
                {zoom ? "Mostrar inteira" : "Ampliar"}
              </Button>
            </div>
            <Dialog.Close asChild>
              <Button
                className="absolute top-4 right-4"
                variant="secondary"
                aria-label="Fechar galeria"
              >
                <X />
              </Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
