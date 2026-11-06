"use client";
import { useState } from "react";
import { toast } from "sonner";
import type { MotoPublica } from "@/lib/data/schemas";
import { useConfigLoja } from "@/lib/data/hooks";
import { registrarAtendimento } from "@/lib/data/attendance";
import {
  mensagemTroca,
  mensagemFinanciamento,
  linkWhatsApp,
  trocaSchema,
  financiamentoSchema,
} from "@/lib/whatsapp";
import { Button } from "../ui/button";
import { Input } from "../ui/primitives";
import { Field, Select } from "../ui/field";
import { ResponsivePanel } from "../ui/responsive-panel";
export function ContactFlow({
  moto,
  tipo,
  children,
}: {
  moto: MotoPublica;
  tipo: "troca" | "financiamento";
  children?: React.ReactNode;
}) {
  const config = useConfigLoja();
  const [open, setOpen] = useState(false);
  const [etapa, setEtapa] = useState(0);
  const [mensagem, setMensagem] = useState("");
  const [troca, setTroca] = useState({
    modelo: "",
    ano: 2020,
    faixaKm: "Até 20.000 km",
    estado: "Bom" as "Ótimo" | "Bom" | "Precisa de reparos",
    financiarDiferenca: false,
  });
  const [entrada, setEntrada] = useState("");
  const [prazo, setPrazo] = useState<24 | 36 | 48>(36);
  const [erro, setErro] = useState("");
  function avancar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (tipo === "troca" && etapa === 0) {
      const parsed = trocaSchema
        .pick({ modelo: true, ano: true })
        .safeParse(troca);
      if (!parsed.success) {
        setErro("Informe o modelo e um ano válido.");
        return;
      }
      setEtapa(1);
      return;
    }
    if (tipo === "troca") {
      const result = trocaSchema.safeParse(troca);
      if (!result.success) {
        setErro("Confira os dados da sua moto.");
        return;
      }
      setMensagem(mensagemTroca(config, moto, result.data));
    } else {
      const result = financiamentoSchema.safeParse({
        entrada: entrada === "" ? undefined : Number(entrada),
        prazo,
      });
      if (!result.success) {
        setErro("Informe uma entrada válida.");
        return;
      }
      setMensagem(mensagemFinanciamento(config, moto, result.data));
    }
    setEtapa(2);
  }
  return (
    <>
      <Button
        variant="secondary"
        onClick={() => {
          setOpen(true);
          setEtapa(0);
          setErro("");
        }}
      >
        {children ??
          (tipo === "troca"
            ? "Oferecer minha moto na troca"
            : "Consultar financiamento")}
      </Button>
      <ResponsivePanel
        open={open}
        onOpenChange={setOpen}
        title={
          tipo === "troca"
            ? "Sua moto pode ser o próximo passo."
            : "Vamos consultar as condições?"
        }
        description={
          tipo === "troca"
            ? "A avaliação é feita pela equipe da loja. Não há estimativa automática."
            : "Solicite uma simulação à equipe. Não calculamos parcelas ou taxas."
        }
      >
        {etapa < 2 ? (
          <form onSubmit={avancar} className="space-y-4">
            {tipo === "troca" ? (
              etapa === 0 ? (
                <>
                  <p className="eyebrow">1 / Sua moto</p>
                  <Field label="Modelo da sua moto">
                    <Input
                      required
                      list="modelos-troca"
                      value={troca.modelo}
                      onChange={(e) =>
                        setTroca({ ...troca, modelo: e.target.value })
                      }
                      placeholder="Ex.: Honda CG 160 Fan"
                    />
                  </Field>
                  <datalist id="modelos-troca">
                    <option>Honda CG 160 Fan</option>
                    <option>Honda Bros 160</option>
                    <option>Yamaha Fazer 250</option>
                  </datalist>
                  <Field label="Ano da sua moto">
                    <Input
                      type="number"
                      min="1900"
                      max="2100"
                      required
                      value={troca.ano}
                      onChange={(e) =>
                        setTroca({ ...troca, ano: Number(e.target.value) })
                      }
                    />
                  </Field>
                </>
              ) : (
                <>
                  <p className="eyebrow">2 / Estado da moto</p>
                  <Field label="Faixa de quilometragem">
                    <Select
                      value={troca.faixaKm}
                      onChange={(e) =>
                        setTroca({ ...troca, faixaKm: e.target.value })
                      }
                    >
                      {[
                        "Até 20.000 km",
                        "20.001 a 50.000 km",
                        "Mais de 50.000 km",
                      ].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Estado de conservação">
                    <Select
                      value={troca.estado}
                      onChange={(e) =>
                        setTroca({
                          ...troca,
                          estado: e.target.value as typeof troca.estado,
                        })
                      }
                    >
                      {["Ótimo", "Bom", "Precisa de reparos"].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </Select>
                  </Field>
                  <label className="check-field">
                    <input
                      type="checkbox"
                      checked={troca.financiarDiferenca}
                      onChange={(e) =>
                        setTroca({
                          ...troca,
                          financiarDiferenca: e.target.checked,
                        })
                      }
                    />
                    Quero financiar a diferença
                  </label>
                </>
              )
            ) : (
              <>
                <Field label="Entrada pretendida (opcional)">
                  <Input
                    type="number"
                    min="0"
                    value={entrada}
                    onChange={(e) => setEntrada(e.target.value)}
                    placeholder="Valor em reais"
                  />
                </Field>
                <Field label="Prazo de interesse">
                  <Select
                    value={prazo}
                    onChange={(e) =>
                      setPrazo(Number(e.target.value) as 24 | 36 | 48)
                    }
                  >
                    <option value="24">24 meses</option>
                    <option value="36">36 meses</option>
                    <option value="48">48 meses</option>
                  </Select>
                </Field>
              </>
            )}
            {erro && (
              <p role="alert" className="text-danger text-sm">
                {erro}
              </p>
            )}
            <div className="flex gap-3">
              {etapa === 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEtapa(0)}
                >
                  Voltar
                </Button>
              )}
              <Button type="submit">
                {tipo === "troca" && etapa === 0
                  ? "Continuar"
                  : "Ver prévia da mensagem"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="eyebrow">Prévia para o WhatsApp</p>
            <pre className="message-preview">{mensagem}</pre>
            <p className="text-xs text-muted">
              O WhatsApp será aberto. Você ainda precisa enviar a mensagem.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="ghost"
                onClick={() => setEtapa(tipo === "troca" ? 1 : 0)}
              >
                Editar
              </Button>
              <Button asChild>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={linkWhatsApp(config.whatsapp, mensagem)}
                  onClick={(e) => {
                    try {
                      registrarAtendimento(
                        config.whatsapp,
                        mensagem,
                        tipo,
                        moto.id,
                      );
                    } catch {
                      e.preventDefault();
                      toast.error("Não foi possível registrar o clique.");
                    }
                  }}
                >
                  Abrir WhatsApp
                </a>
              </Button>
            </div>
          </div>
        )}
      </ResponsivePanel>
    </>
  );
}
