import { loadScene, loadOrbs } from "../main.ts";
import { setUpScript } from "./slider.ts";
export async function loadContent(url: string, contentContainer: HTMLElement | null, callbacks? : Array<CallableFunction>): Promise<void> {
    try {
        const response = await fetch(url); // Cargar el archivo HTML
        if (!response.ok) {
            
            throw new Error(`Error al cargar ${url}: ${response.statusText}`);
        }
        const html = await response.text(); // Obtener el contenido como texto
        if (contentContainer) {
            const threeContainer = document.getElementById("three-container")
            console.log(html)
            contentContainer.innerHTML = ''; // Limpia el contenedor antes de insertar contenido nuevo
            contentContainer.innerHTML = html; // Insertar el contenido en el contenedor
            callbacks?.forEach(callback => {
                callback(); // Llamar a cada función de callback
                console.log(callback)
            });
        }
    } catch (error) {
        console.error(error);
        if (contentContainer) {
            contentContainer.innerHTML = `<p>Error al cargar el contenido.</p>`;
        }
    }
}

export const LoadActions: Record<string, Array<CallableFunction>>= {
    "about.html": [loadScene],
    "projects.html": [setUpScript, loadOrbs],
    
  };