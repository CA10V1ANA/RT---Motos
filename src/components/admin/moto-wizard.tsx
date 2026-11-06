"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motoSchema, identificacaoSchema, type Moto } from "@/lib/data/schemas";
import { useMotosAdmin, useDadosProntos } from "@/lib/data/hooks";
import { motoRepository } from "@/lib/data/repository";
import { criarRascunho, rascunhoRepository } from "@/lib/data/drafts";
import { motoPublica } from "@/lib/data/selectors";
import { Button } from "../ui/button";
import { MotoCard } from "../public/moto-card";
import { MotoPresentation } from "../public/moto-presentation";
import { IdentificationStep } from "./identification-step";
import { PhotoSorter } from "./photo-sorter";
import { HotspotEditor } from "./hotspot-editor";
import { AnnouncementStep } from "./announcement-step";
const etapas = [
  "Identificação",
  "Fotos e Raio-X",
  "Anúncio e custos",
  "Revisar e publicar",
];
export function MotoWizard({ id }: { id?: string }) {
  const motos = useMotosAdmin();
  const pronto = useDadosProntos();
  if (!pronto) return <p className="text-muted">Preparando formulário…</p>;
  const original = id ? motos.find((m) => m.id === id) : undefined;
  if (id && !original)
    return (
      <div className="empty-state">
        <h1>Moto não encontrada</h1>
      </div>
    );
  return <WizardForm key={id ?? "nova"} original={original} />;
}
function WizardForm({ original }: { original?: Moto }) {
  const router = useRouter();
  const chave = original?.id ?? "nova";
  const [moto, setMoto] = useState<Moto>(
    () => rascunhoRepository.obter(chave) ?? original ?? criarRascunho(),
  );
  const [etapa, setEtapa] = useState(0);
  const [erro, setErro] = useState("");
  const [saved, setSaved] = useState("");
  const [preview, setPreview] = useState<"card" | "pagina">("card");
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        rascunhoRepository.salvar(chave, moto);
        if (
          moto.id !== "nova" &&
          moto.publicacao === "rascunho" &&
          motoSchema.safeParse(moto).success
        )
          motoRepository.atualizar(moto.id, moto);
        setSaved("Rascunho salvo automaticamente neste navegador.");
      } catch {
        setSaved(
          "Não foi possível salvar o rascunho. Confira o espaço do navegador.",
        );
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [chave, moto]);
  function validar() {
    const parsed =
      etapa === 0
        ? identificacaoSchema.safeParse(moto)
        : motoSchema.safeParse(moto);
    if (!parsed.success) {
      setErro(
        "Confira os campos: " +
          [...new Set(parsed.error.issues.map((i) => i.path.join(".")))].join(
            ", ",
          ),
      );
      return false;
    }
    setErro("");
    return true;
  }
  function avancar() {
    if (!validar()) return;
    if (moto.id === "nova") {
      try {
        const criada = motoRepository.criar({
          ...moto,
          publicacao: "rascunho",
        });
        setMoto(criada);
        rascunhoRepository.salvar(chave, criada);
      } catch {
        setErro("Não foi possível salvar a moto. Confira os campos.");
        return;
      }
    }
    setEtapa((e) => Math.min(3, e + 1));
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function salvar(publicar: boolean) {
    if (!motoSchema.safeParse(moto).success) {
      setErro("Complete a identificação e confira os dados antes de salvar.");
      return;
    }
    if (publicar && (!moto.fotos.length || !moto.descricao.trim())) {
      setErro(
        "Adicione uma foto de capa e uma descrição antes de publicar. O preço pode ficar sob consulta.",
      );
      return;
    }
    try {
      const dados = {
        ...moto,
        publicacao: publicar ? ("publicado" as const) : ("rascunho" as const),
      };
      const resultado =
        moto.id === "nova"
          ? motoRepository.criar(dados)
          : motoRepository.atualizar(moto.id, dados);
      rascunhoRepository.remover(chave);
      toast.success(
        publicar
          ? `${resultado.codigo} publicado no catálogo.`
          : "Rascunho salvo.",
      );
      router.push("/admin/motos");
    } catch {
      setErro("Não foi possível salvar. Confira o armazenamento do navegador.");
    }
  }
  return (
    <div className="wizard">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            {moto.codigo === "RT-000" ? "Novo anúncio" : moto.codigo}
          </p>
          <h1 className="page-title mt-3">
            {original
              ? "Cada detalhe conta."
              : "Uma nova moto. Novas histórias."}
          </h1>
        </div>
        <p className="text-xs text-muted" aria-live="polite">
          {saved}
        </p>
      </div>
      <ol className="wizard-steps">
        {etapas.map((e, i) => (
          <li key={e} aria-current={etapa === i ? "step" : undefined}>
            <span>{i + 1}</span>
            {e}
          </li>
        ))}
      </ol>
      <section className="wizard-body surface rounded-2xl">
        <h2 className="text-2xl font-bold mb-6">{etapas[etapa]}</h2>
        {etapa === 0 && <IdentificationStep moto={moto} onChange={setMoto} />}
        {etapa === 1 && (
          <>
            <PhotoSorter moto={moto} onChange={setMoto} />
            <HotspotEditor moto={moto} onChange={setMoto} />
          </>
        )}
        {etapa === 2 && <AnnouncementStep moto={moto} onChange={setMoto} />}
        {etapa === 3 && (
          <>
            <ul className="review-checklist">
              <li>{moto.fotos.length ? "✓" : "○"} Foto de capa</li>
              <li>
                {moto.preco === null
                  ? "○ Valor sob consulta (permitido)"
                  : "✓ Preço informado"}
              </li>
              <li>{moto.descricao.trim() ? "✓" : "○"} Descrição</li>
            </ul>
            <div className="segments mb-6">
              <button
                aria-pressed={preview === "card"}
                onClick={() => setPreview("card")}
              >
                Prévia do card
              </button>
              <button
                aria-pressed={preview === "pagina"}
                onClick={() => setPreview("pagina")}
              >
                Prévia da página
              </button>
            </div>
            {preview === "card" ? (
              <div className="max-w-sm">
                <MotoCard preview moto={motoPublica(moto)} />
              </div>
            ) : (
              <MotoPresentation preview moto={motoPublica(moto)} />
            )}
          </>
        )}
        {erro && (
          <p role="alert" className="form-error">
            {erro}
          </p>
        )}
        <div className="wizard-actions">
          {etapa > 0 && (
            <Button
              variant="secondary"
              onClick={() => {
                setEtapa((e) => e - 1);
                setErro("");
              }}
            >
              Voltar
            </Button>
          )}
          <Button variant="ghost" onClick={() => salvar(false)}>
            Salvar rascunho
          </Button>
          {etapa < 3 ? (
            <Button onClick={avancar}>Continuar</Button>
          ) : (
            <Button onClick={() => salvar(true)}>
              {original?.publicacao === "publicado"
                ? "Salvar e publicar alterações"
                : "Publicar moto"}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
