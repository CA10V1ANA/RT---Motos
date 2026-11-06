"use client";
import { createStore } from "zustand/vanilla";
import {
  persist,
  createJSONStorage,
  type StateStorage,
} from "zustand/middleware";
import { criarSeed } from "./seed";
import { dadosSchema, type DadosDemo } from "./schemas";

export const STORAGE_KEY = "rt-motos-demo-v2";
let channel: BroadcastChannel | undefined;
let erroPersistencia: string | null = null;
const storage: StateStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      erroPersistencia = "O navegador bloqueou o armazenamento local.";
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      channel?.postMessage("atualizado");
    } catch {
      erroPersistencia =
        "Não foi possível salvar neste navegador. Verifique o espaço disponível e as permissões.";
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      erroPersistencia = "Não foi possível limpar os dados locais.";
    }
  },
};
export function consumirErroPersistencia() {
  const erro = erroPersistencia;
  erroPersistencia = null;
  return erro;
}
export const demoStore = createStore<DadosDemo>()(
  persist(() => criarSeed(), {
    name: STORAGE_KEY,
    version: 1,
    skipHydration: true,
    storage: createJSONStorage(() => storage),
    merge: (persistido, atual) => {
      const result = dadosSchema.safeParse(persistido);
      return result.success ? result.data : atual;
    },
  }),
);
let inicio: Promise<void> | undefined;
let ouvintes = 0;
export function iniciarDados() {
  inicio ??= Promise.resolve(demoStore.persist.rehydrate()).then(
    () => undefined,
  );
  return inicio;
}
export function sincronizarAbas() {
  ouvintes++;
  const atualizar = () => {
    void demoStore.persist.rehydrate();
  };
  const evento = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) atualizar();
  };
  if (ouvintes === 1 && typeof BroadcastChannel !== "undefined") {
    channel = new BroadcastChannel("rt-motos-demo");
    channel.onmessage = atualizar;
  }
  window.addEventListener("storage", evento);
  return () => {
    window.removeEventListener("storage", evento);
    if (--ouvintes === 0) {
      channel?.close();
      channel = undefined;
    }
  };
}
