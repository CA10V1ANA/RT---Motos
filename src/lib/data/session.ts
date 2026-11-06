"use client";
import { useSyncExternalStore } from "react";
const KEY = "rt-motos-sessao-demo";
const subscribe = (callback: () => void) => {
  window.addEventListener("rt-sessao", callback);
  return () => window.removeEventListener("rt-sessao", callback);
};
function snapshot() {
  try {
    return sessionStorage.getItem(KEY) === "ativa";
  } catch {
    return false;
  }
}
export function entrarDemo() {
  sessionStorage.setItem(KEY, "ativa");
  window.dispatchEvent(new Event("rt-sessao"));
}
export function sairDemo() {
  sessionStorage.removeItem(KEY);
  window.dispatchEvent(new Event("rt-sessao"));
}
export const useSessaoDemo = () =>
  useSyncExternalStore(subscribe, snapshot, () => false);
