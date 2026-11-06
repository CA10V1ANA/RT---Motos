"use client";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import type { serieMensal } from "@/lib/finance";
import { formatarMoeda } from "@/lib/format";
export function SalesChart({
  dados,
}: {
  dados: ReturnType<typeof serieMensal>;
}) {
  return (
    <div>
      <div
        className="sales-chart"
        role="img"
        aria-label="Gráfico mensal de faturamento, custos e lucro; valores disponíveis na tabela abaixo."
      >
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <ComposedChart
            data={dados}
            margin={{ top: 16, right: 10, bottom: 8, left: 0 }}
            accessibilityLayer
          >
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,.06)" />
            <XAxis
              dataKey="mes"
              stroke="#A1A1AA"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              stroke="#A1A1AA"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              width={48}
              tickFormatter={(v) => `${Number(v) / 1000} mil`}
            />
            <Tooltip
              contentStyle={{
                background: "#141418",
                border: "1px solid rgba(255,255,255,.16)",
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: "#F4F4F5" }}
              formatter={(v) => formatarMoeda(Number(v))}
              cursor={{ fill: "rgba(255,255,255,.03)" }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar
              dataKey="receita"
              name="Faturamento"
              fill="#D4D4D8"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
              isAnimationActive={false}
            />
            <Bar
              dataKey="custo"
              name="Custos"
              fill="#DC2626"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
              isAnimationActive={false}
            />
            <Line
              dataKey="lucro"
              name="Lucro"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <details className="text-xs text-muted mt-4">
        <summary className="cursor-pointer min-h-11 flex items-center">
          Consultar valores do gráfico
        </summary>
        <div className="overflow-x-auto">
          <table className="chart-table">
            <caption className="sr-only">Resultados mensais em reais</caption>
            <thead>
              <tr>
                <th>Mês</th>
                <th>Faturamento</th>
                <th>Custos</th>
                <th>Lucro</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((d) => (
                <tr key={d.mes}>
                  <td>{d.mes}</td>
                  <td>{formatarMoeda(d.receita)}</td>
                  <td>{formatarMoeda(d.custo)}</td>
                  <td>{formatarMoeda(d.lucro)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
