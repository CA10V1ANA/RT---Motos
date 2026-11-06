"use client";
import { useState } from "react";
import type { Moto } from "@/lib/data/schemas";
import { Field, Select, Textarea } from "../ui/field";
import { Input, Badge } from "../ui/primitives";
import { Button } from "../ui/button";
import { ProfitEditor } from "./profit-editor";
export function AnnouncementStep({
  moto,
  onChange,
}: {
  moto: Moto;
  onChange: (m: Moto) => void;
}) {
  const [acessorio, setAcessorio] = useState("");
  return (
    <div className="space-y-6">
      <div className="form-grid">
        <Field label="Modalidade">
          <Select
            value={moto.modalidade}
            onChange={(e) =>
              onChange({
                ...moto,
                modalidade: e.target.value as Moto["modalidade"],
              })
            }
          >
            <option value="estoque_proprio">Estoque próprio</option>
            <option value="repasse">Repasse</option>
          </Select>
        </Field>
        <label className="check-field">
          <input
            type="checkbox"
            checked={moto.destaque}
            onChange={(e) => onChange({ ...moto, destaque: e.target.checked })}
          />
          Destacar no catálogo
        </label>
        <label className="check-field">
          <input
            type="checkbox"
            checked={moto.aceitaTroca}
            onChange={(e) =>
              onChange({ ...moto, aceitaTroca: e.target.checked })
            }
          />
          Aceita troca
        </label>
        <label className="check-field">
          <input
            type="checkbox"
            checked={moto.financiamento}
            onChange={(e) =>
              onChange({ ...moto, financiamento: e.target.checked })
            }
          />
          Financiamento
        </label>
      </div>
      <Field label="Descrição do anúncio">
        <Textarea
          value={moto.descricao}
          onChange={(e) => onChange({ ...moto, descricao: e.target.value })}
        />
      </Field>
      <Field label="Condições desta moto">
        <Textarea
          value={moto.condicoesTexto ?? ""}
          onChange={(e) =>
            onChange({ ...moto, condicoesTexto: e.target.value })
          }
          placeholder="Condições de troca, repasse ou observações…"
        />
      </Field>
      <Field label="Adicionar acessório">
        <div className="flex gap-2">
          <Input
            value={acessorio}
            onChange={(e) => setAcessorio(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              const v = acessorio.trim();
              if (v && !moto.acessorios.includes(v))
                onChange({ ...moto, acessorios: [...moto.acessorios, v] });
              setAcessorio("");
            }}
          >
            Incluir
          </Button>
        </div>
      </Field>
      <div className="flex flex-wrap gap-2">
        {moto.acessorios.map((a) => (
          <button
            type="button"
            key={a}
            aria-label={`Remover acessório ${a}`}
            onClick={() =>
              onChange({
                ...moto,
                acessorios: moto.acessorios.filter((x) => x !== a),
              })
            }
          >
            <Badge>{a} ×</Badge>
          </button>
        ))}
      </div>
      <ProfitEditor moto={moto} onChange={onChange} />
      <Field label="Observações internas de custo">
        <Textarea
          value={moto.custos.observacoes ?? ""}
          onChange={(e) =>
            onChange({
              ...moto,
              custos: { ...moto.custos, observacoes: e.target.value },
            })
          }
        />
      </Field>
    </div>
  );
}
