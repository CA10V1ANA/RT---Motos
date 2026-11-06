"use client";
import { useMemo, useSyncExternalStore } from "react";
import { useStore } from "zustand";
import { demoStore } from "./store";
import { selecionarMotosPublicas, selecionarMotoPublica } from "./selectors";
import { calcularKpis, type Periodo } from "../finance";
const subscribeHydration = (callback: () => void) =>
  demoStore.persist.onFinishHydration(callback);
export function useDadosProntos() {
  return useSyncExternalStore(
    subscribeHydration,
    () => demoStore.persist.hasHydrated(),
    () => false,
  );
}
export function useMotosPublicas() {
  const motos = useStore(demoStore, (s) => s.motos);
  return useMemo(() => selecionarMotosPublicas(motos), [motos]);
}
export function useMoto(slug: string) {
  const motos = useStore(demoStore, (s) => s.motos);
  return useMemo(() => selecionarMotoPublica(motos, slug), [motos, slug]);
}
export const useMotosAdmin = () => useStore(demoStore, (s) => s.motos);
export const useConfigLoja = () => useStore(demoStore, (s) => s.config);
export const useCliques = () => useStore(demoStore, (s) => s.cliques);
export const useGeracaoDemo = () => useStore(demoStore, (s) => s.geracao);
export function useKpis(periodo: Periodo, agora?: Date) {
  const motos = useMotosAdmin();
  return useMemo(
    () => calcularKpis(motos, periodo, agora),
    [motos, periodo, agora],
  );
}
