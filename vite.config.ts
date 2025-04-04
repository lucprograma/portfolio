import { defineConfig } from 'vite';

export default defineConfig({
  base: 'https://lucprograma.github.io/portfolio/', // Reemplaza <nombre-del-repositorio> con el nombre de tu repositorio
  build: {
    outDir: 'dist', // Carpeta de salida para la build
  },
});