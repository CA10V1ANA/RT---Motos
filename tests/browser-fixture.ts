// Empacotado em memória pelo teste; nunca enviado com a aplicação.
import {
  motoRepository,
  configRepository,
  cliqueRepository,
  restaurarDemo,
} from "../src/lib/data/repository";
import { salvarFoto, lerFoto } from "../src/lib/data/photos";
import { iniciarDados, sincronizarAbas } from "../src/lib/data/store";
Object.assign(window, {
  rtTeste: {
    motoRepository,
    configRepository,
    cliqueRepository,
    restaurarDemo,
    salvarFoto,
    lerFoto,
    iniciarDados,
    sincronizarAbas,
  },
});
