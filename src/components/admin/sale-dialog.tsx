"use client";
import { useState } from "react";
import { toast } from "sonner";
import type { Moto, Venda } from "@/lib/data/schemas";
import { vendaSchema } from "@/lib/data/schemas";
import { motoRepository } from "@/lib/data/repository";
import { lucroMoto } from "@/lib/finance";
import { formatarMoeda } from "@/lib/format";
import { ResponsivePanel } from "../ui/responsive-panel";
import { Button } from "../ui/button";
import { Field, Select, Textarea } from "../ui/field";
import { Input } from "../ui/primitives";
export function SaleDialog({
  moto,
  open,
  onOpenChange,
  onSold,
}: {
  moto: Moto;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSold?: () => void;
}) {
  const hoje = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Fortaleza",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const [valor, setValor] = useState(moto.preco ?? 0);
  const [data, setData] = useState(hoje);
  const [forma, setForma] = useState<NonNullable<Venda["forma"]>>("a_vista");
  const [obs, setObs] = useState("");
  const [erro, setErro] = useState("");
  function vender(e: React.FormEvent) {
    e.preventDefault();
    const venda = vendaSchema.safeParse({
      valorFinal: valor,
      data: `${data}T12:00:00-03:00`,
      forma,
      observacao: obs,
    });
    if (
      !venda.success ||
      Date.parse(venda.data.data) < Date.parse(moto.dataEntrada)
    ) {
      setErro("Informe valor e data válidos, a partir da entrada da moto.");
      return;
    }
    try {
      const m = motoRepository.registrarVenda(moto.id, venda.data);
      toast.success(
        `Venda registrada. Lucro realizado: ${formatarMoeda(lucroMoto(m))}`,
      );
      onOpenChange(false);
      onSold?.();
    } catch {
      setErro(
        "Não foi possível registrar a venda. Confira os dados e tente novamente.",
      );
    }
  }
  return (
    <ResponsivePanel
      open={open}
      onOpenChange={onOpenChange}
      title="Registrar venda"
      description={`${moto.codigo} · ${moto.marca} ${moto.modelo}`}
    >
      <form onSubmit={vender} className="space-y-4">
        <Field label="Valor final da venda">
          <Input
            required
            type="number"
            min="0"
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
          />
        </Field>
        <Field label="Data da venda">
          <Input
            required
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </Field>
        <Field label="Forma (informativa)">
          <Select
            value={forma}
            onChange={(e) => setForma(e.target.value as typeof forma)}
          >
            <option value="a_vista">À vista</option>
            <option value="financiada">Financiada</option>
            <option value="com_troca">Com troca</option>
            <option value="outra">Outra</option>
          </Select>
        </Field>
        <Field label="Observação">
          <Textarea value={obs} onChange={(e) => setObs(e.target.value)} />
        </Field>
        <p className="text-sm text-success">
          Lucro realizado: {formatarMoeda(lucroMoto(moto, valor))}
        </p>
        {erro && (
          <p role="alert" className="text-danger text-sm">
            {erro}
          </p>
        )}
        <Button type="submit" className="w-full">
          Confirmar venda
        </Button>
      </form>
    </ResponsivePanel>
  );
}
