"use client";
import type { Moto } from "@/lib/data/schemas";
import { Field, Select } from "../ui/field";
import { Input } from "../ui/primitives";
export function IdentificationStep({
  moto,
  onChange,
}: {
  moto: Moto;
  onChange: (m: Moto) => void;
}) {
  const texto = (key: keyof Moto, value: string) =>
    onChange({ ...moto, [key]: value });
  return (
    <div className="form-grid">
      <Field label="Marca">
        <Input
          required
          value={moto.marca}
          onChange={(e) => texto("marca", e.target.value)}
          placeholder="Ex.: Honda"
        />
      </Field>
      <Field label="Modelo">
        <Input
          required
          value={moto.modelo}
          onChange={(e) => texto("modelo", e.target.value)}
          placeholder="Ex.: CG 160 Fan"
        />
      </Field>
      <Field label="Versão">
        <Input
          value={moto.versao ?? ""}
          onChange={(e) => texto("versao", e.target.value)}
        />
      </Field>
      <Field label="Cor">
        <Input
          required
          value={moto.cor}
          onChange={(e) => texto("cor", e.target.value)}
        />
      </Field>
      {(
        [
          ["anoFabricacao", "Ano de fabricação"],
          ["anoModelo", "Ano do modelo"],
          ["km", "Quilometragem"],
          ["cilindrada", "Cilindrada (cc)"],
        ] as const
      ).map(([key, label]) => (
        <Field key={key} label={label}>
          <Input
            required
            type="number"
            min={key.startsWith("ano") ? 1900 : 0}
            max={key.startsWith("ano") ? 2100 : undefined}
            value={moto[key]}
            onChange={(e) =>
              onChange({ ...moto, [key]: Number(e.target.value) })
            }
          />
        </Field>
      ))}
      <Field label="Combustível">
        <Select
          value={moto.combustivel}
          onChange={(e) => texto("combustivel", e.target.value)}
        >
          <option>Flex</option>
          <option>Gasolina</option>
          <option>Elétrica</option>
        </Select>
      </Field>
      <Field label="Partida">
        <Select
          value={moto.partida ?? ""}
          onChange={(e) => texto("partida", e.target.value)}
        >
          <option>Elétrica</option>
          <option>Pedal</option>
          <option>Elétrica e pedal</option>
        </Select>
      </Field>
      <Field label="Freios">
        <Input
          value={moto.freios ?? ""}
          onChange={(e) => texto("freios", e.target.value)}
          placeholder="ABS, CBS…"
        />
      </Field>
      <Field label="Condição">
        <Select
          value={moto.condicao}
          onChange={(e) => texto("condicao", e.target.value)}
        >
          <option value="seminova">Seminova</option>
          <option value="nova">Nova</option>
        </Select>
      </Field>
      <Field label="Documentação">
        <Input
          value={moto.documentacao ?? ""}
          onChange={(e) => texto("documentacao", e.target.value)}
        />
      </Field>
    </div>
  );
}
