"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useConfigLoja } from "@/lib/data/hooks";
import { configRepository, restaurarDemo } from "@/lib/data/repository";
import { configSchema, type ConfigLoja } from "@/lib/data/schemas";
import { linkWhatsApp } from "@/lib/whatsapp";
import { Field, Textarea } from "../ui/field";
import { Input, Card } from "../ui/primitives";
import { Button } from "../ui/button";
import { ConfirmDialog } from "../ui/confirm-dialog";
const campos: [keyof ConfigLoja, string][] = [
  ["nome", "Nome da loja"],
  ["cidade", "Cidade"],
  ["endereco", "Endereço"],
  ["horario", "Horário de funcionamento"],
  ["instagram", "Instagram"],
  ["urlBase", "URL base dos anúncios"],
];
function mascara(numero: string) {
  const n = numero.replace(/\D/g, "").slice(0, 13);
  if (n.length <= 2) return `+${n}`;
  return `+${n.slice(0, 2)} (${n.slice(2, 4)}) ${n.slice(4, 9)}${n.length > 9 ? "-" + n.slice(9) : ""}`;
}
export function Settings() {
  const config = useConfigLoja();
  return <SettingsForm key={JSON.stringify(config)} initial={config} />;
}
function SettingsForm({ initial }: { initial: ConfigLoja }) {
  const [dados, setDados] = useState(initial);
  const [erro, setErro] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  function salvar(e: React.FormEvent) {
    e.preventDefault();
    const parsed = configSchema.safeParse(dados);
    if (!parsed.success) {
      setErro(
        "Confira o nome, cidade, WhatsApp com DDI 55 e a URL completa (http:// ou https://).",
      );
      return;
    }
    try {
      configRepository.atualizar(parsed.data);
      toast.success("Configurações atualizadas.");
      setErro("");
    } catch {
      setErro("Não foi possível salvar neste navegador.");
    }
  }
  return (
    <>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Identidade e contato</p>
          <h1 className="page-title mt-3">Do seu jeito. Com a sua marca.</h1>
        </div>
      </div>
      <form
        onSubmit={salvar}
        className="surface rounded-2xl p-6 space-y-6 max-w-4xl"
      >
        <div className="form-grid">
          {campos.map(([key, label]) => (
            <Field key={key} label={label}>
              <Input
                type={key === "urlBase" ? "url" : "text"}
                required={["nome", "cidade", "urlBase"].includes(key)}
                value={dados[key]}
                onChange={(e) => setDados({ ...dados, [key]: e.target.value })}
              />
            </Field>
          ))}
          <Field label="WhatsApp com DDI e DDD">
            <Input
              type="tel"
              value={mascara(dados.whatsapp)}
              onChange={(e) =>
                setDados({
                  ...dados,
                  whatsapp: e.target.value.replace(/\D/g, ""),
                })
              }
            />
          </Field>
        </div>
        <Field label="Apresentação da loja">
          <Textarea
            value={dados.apresentacao}
            onChange={(e) =>
              setDados({ ...dados, apresentacao: e.target.value })
            }
          />
        </Field>
        {erro && (
          <p className="form-error" role="alert">
            {erro}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <Button type="submit">Salvar configurações</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              try {
                window.open(
                  linkWhatsApp(
                    dados.whatsapp,
                    "Olá! Estou testando o contato da RT Motos.",
                  ),
                  "_blank",
                  "noopener,noreferrer",
                );
              } catch {
                setErro(
                  "Informe um número válido com DDI 55 e DDD antes de testar.",
                );
              }
            }}
          >
            Testar link
          </Button>
        </div>
        <p className="text-xs text-muted">
          O número inicial é fictício. Substitua pelo contato correto antes de
          compartilhar a demonstração.
        </p>
      </form>
      <Card className="p-6 mt-8 max-w-4xl">
        <h2 className="text-xl font-bold">Demonstração</h2>
        <p className="text-sm text-muted my-4">
          Volte aos exemplos iniciais. Alterações, rascunhos e fotos enviadas
          serão removidos deste navegador.
        </p>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Restaurar dados de exemplo
        </Button>
      </Card>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Restaurar a demonstração?"
        description="Todas as alterações e fotos enviadas neste navegador serão removidas. As outras abas abertas também serão atualizadas."
        busy={busy}
        onConfirm={() => {
          setBusy(true);
          void restaurarDemo()
            .then(() => {
              setOpen(false);
              toast.success("Dados de exemplo restaurados.");
            })
            .catch(() => toast.error("Não foi possível restaurar."))
            .finally(() => setBusy(false));
        }}
      />
    </>
  );
}
