import { createStore, get, set, del, clear } from "idb-keyval";
import { comprimirImagem } from "../images";
let db: ReturnType<typeof createStore> | undefined;
const banco = () => (db ??= createStore("rt-motos-fotos", "fotos"));
export async function salvarFoto(arquivo: File) {
  const blob = await comprimirImagem(arquivo);
  const id = crypto.randomUUID();
  await set(id, blob, banco());
  return `idb:${id}`;
}
export async function lerFoto(src: string): Promise<Blob | undefined> {
  return src.startsWith("idb:") ? get<Blob>(src.slice(4), banco()) : undefined;
}
export async function excluirFoto(src: string) {
  if (src.startsWith("idb:")) await del(src.slice(4), banco());
}
export async function limparFotos() {
  await clear(banco());
}
