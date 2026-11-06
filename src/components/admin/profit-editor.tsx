"use client";
import type { Moto } from "@/lib/data/schemas";
import { custoTotal, lucroMoto, margemMoto } from "@/lib/finance";
import { formatarMoeda, formatarPercentual } from "@/lib/format";
import { Field } from "../ui/field";
import { Input } from "../ui/primitives";
import { AnimatedNumber } from "../ui/animated-number";
const labels = {
  aquisicao: "Aquisição",
  oficina: "Oficina",
  estetica: "Estética",
  documentacao: "Documentação",
  outros: "Outros",
} as const;
export function ProfitEditor({
  moto,
  onChange,
}: {
  moto: Moto;
  onChange: (moto: Moto) => void;
}) {
  const lucro = lucroMoto(moto, moto.preco);
  const margem = margemMoto(moto, moto.preco);
  const cor =
    lucro !== null && lucro < 0
      ? "var(--danger)"
      : margem !== null && margem < 10
        ? "var(--warning)"
        : "var(--success)";
  return (
    <section className="profit-editor">
      <p className="eyebrow">Custos internos — só a loja vê</p>
      <div className="profit-costs">
        {Object.entries(labels).map(([key, label]) => (
          <Field key={key} label={label}>
            <Input
              aria-label={`Custo de ${label.toLowerCase()}`}
              type="number"
              min="0"
              step="1"
              value={moto.custos[key as keyof typeof labels]}
              onChange={(e) =>
                onChange({
                  ...moto,
                  custos: { ...moto.custos, [key]: Number(e.target.value) },
                })
              }
            />
          </Field>
        ))}
      </div>
      <p className="text-xs text-muted mb-4">
        Custo total{" "}
        <strong className="font-mono text-silver ml-2">
          {formatarMoeda(custoTotal(moto.custos))}
        </strong>
      </p>
      <Field label="Preço no catálogo">
        <Input
          type="number"
          min="0"
          value={moto.preco ?? ""}
          placeholder="Deixe vazio para consultar o valor"
          onChange={(e) =>
            onChange({
              ...moto,
              preco: e.target.value === "" ? null : Number(e.target.value),
            })
          }
        />
      </Field>
      <input
        className="price-slider"
        aria-label="Ajustar preço no catálogo"
        type="range"
        min="0"
        max={Math.max(100000, (moto.preco ?? 0) * 1.2)}
        step="50"
        value={moto.preco ?? 0}
        onChange={(e) => onChange({ ...moto, preco: Number(e.target.value) })}
      />
      <div className="profit-display" style={{ borderColor: cor }}>
        <svg
          viewBox="0 0 140 82"
          role="img"
          aria-label={`Margem ${margem === null ? "não calculada" : formatarPercentual(margem)}`}
        >
          <path
            d="M12 70a58 58 0 0 1 116 0"
            fill="none"
            stroke="var(--surface-2)"
            strokeWidth="9"
          />
          <path
            d="M12 70a58 58 0 0 1 116 0"
            fill="none"
            stroke={cor}
            strokeWidth="9"
            pathLength="100"
            strokeDasharray={`${Math.min(100, Math.max(0, (margem ?? 0) * 2))} 100`}
          />
          <path
            d="M70 70V25"
            stroke="var(--silver)"
            strokeWidth="3"
            transform={`rotate(${Math.max(-90, Math.min(90, (margem ?? 0) * 3.6 - 90))} 70 70)`}
          />
          <circle cx="70" cy="70" r="5" fill="var(--silver)" />
        </svg>
        <div>
          <p className="eyebrow">Lucro líquido potencial</p>
          <div
            data-testid="lucro-potencial"
            style={{ color: cor }}
            className="text-2xl mt-2"
          >
            {lucro === null ? (
              "A consultar"
            ) : (
              <AnimatedNumber currency value={lucro} />
            )}
          </div>
          <p className="font-mono text-xs text-muted mt-2">
            Margem {margem === null ? "—" : formatarPercentual(margem)}
          </p>
        </div>
      </div>
    </section>
  );
}
