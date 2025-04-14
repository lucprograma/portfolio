//responsability: Entry point of the application, it handles the logical dependencies
import * as THREE from 'three'; // Importa la biblioteca Three.js
import './style.css'; // Importa el archivo CSS
import { loadContent, LoadActions } from './utils/contentManager'; // Importa la función para cargar contenido HTML
import RendererManager from './treejs/renderer'; // Importa el módulo de renderizado
import { Renderer } from 'three/webgpu';
import { AnimationStrategy, objectFactory, MeshWithStrategy} from './treejs/animationStrategies'; // Importa la estrategia de animación
const contentContainer = document.getElementById("content-container"); // Obtiene el contenedor de contenido
const navButtons = document.querySelectorAll<HTMLButtonElement>('.nav-button');
const container = document.getElementById('three-container');
const render = container ? new RendererManager(container) : null; // Obtiene el renderizador
let objectsToAnimate: MeshWithStrategy[] = []; // Arreglo para almacenar los objetos a animar
navButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault(); // Evitar el comportamiento predeterminado del enlace
        const targetId = button.dataset.file;
        if (targetId) {
            const onLoaded = LoadActions[targetId];
            loadContent(targetId, contentContainer, onLoaded); 
        }
    });
});
const ambientLight = new THREE.HemisphereLight(0xfffff, 0xfffff); // Luz blanca suave
render?.Scene.add(ambientLight);

// Añadir una luz puntual para crear un efecto de iluminación más dinámico
const pointLight = new THREE.PointLight(0xffffff, 0x444444); // Luz blanca intensa
pointLight.position.set(5, 5, 5); // Posición de la luz
render?.Scene.add(pointLight);
loadScene()

function randomRotation(cubes: Array<THREE.Mesh>) {
    cubes.forEach(cube => {
        cube.rotation.x = Math.random() * Math.PI;
        cube.rotation.y = Math.random() * Math.PI;
        cube.rotation.z = Math.random() * Math.PI;
    });
}
// Función de animación

let clock = new THREE.Clock()
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta(); 

    objectsToAnimate.forEach(({ mesh, strategy }) => {
        strategy(mesh, delta); // Ejecuta la estrategia de animación
    });

    render?.Renderer.render(render?.Scene, render?.Camera);
}

animate();

// Ajustar el tamaño del renderizador al cambiar el tamaño de la ventana
if (render){
window.addEventListener('resize', render.onWindowResize, false);
}
export function loadScene(): void {
    clearObjects(); // Limpiar objetos existentes
    if (!render) return;
    const cube1 =  objectFactory('cube', new THREE.Vector3(5, -2, 0));
    const cube2 = objectFactory('cube', new THREE.Vector3(3, 0, 0), 0.7);
    const cube3 =  objectFactory('cube', new THREE.Vector3(5.5, 1, 0), 0.5);
    objectsToAnimate = [cube1, cube2, cube3];
    objectsToAnimate.forEach((object) => {
        console.log(object)
        render?.Scene.add(object.mesh); // Añadir el objeto a la escena
    })
    const loader = new THREE.TextureLoader();
    render.Scene.background = loader.load('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgM44z5na5aQGymKJqakPt0NPjtoCGUvxtBg&s');
    addRendererToContainer(); // Añadir el renderizador al contenedor
}
export function loadOrbs(): void {
    clearObjects(); // Limpiar objetos existentes
    if (!render) return;
    const orb1 = objectFactory('orb', new THREE.Vector3(0, 0, 0), 0.5);
    const orb2 = objectFactory('orb', new THREE.Vector3(1, 1, 0), 0.5);
    const orb3 = objectFactory('orb', new THREE.Vector3(-1, -1, 0), 0.5);
    objectsToAnimate = [orb1, orb2, orb3];
    objectsToAnimate.forEach((object) => {
        render.Scene.add(object.mesh); // Añadir el objeto a la escena
    })
    const loader = new THREE.TextureLoader();
    render.Scene.background = loader.load('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaE5oZcSVbIz7s6EPaxeGhoSgLP_1Z99MmlA&s'); // Fondo de la escena
    addRendererToContainer(); // Añadir el renderizador al contenedor
}
function addRendererToContainer(): void {
    // Verificar si el contenedor principal existe
    if (!contentContainer) {
        console.error("El contenedor principal 'content-container' no existe.");
        return;
    }

    // Verificar si el contenedor de la escena existe
    let sceneContainer = document.getElementById('three-container');
    if (!sceneContainer) {
        // Crear el contenedor si no existe
        sceneContainer = document.createElement('div');
        sceneContainer.id = 'three-container';
        sceneContainer.className = 'absolute inset-0 w-full h-100% z-[-4] overflow-hidden';
        contentContainer.appendChild(sceneContainer);
    }

    // Limpiar el contenido del contenedor de la escena
    sceneContainer.innerHTML = '';

    // Agregar el renderizador al contenedor
    if (render?.Renderer.domElement) {
        sceneContainer.appendChild(render.Renderer.domElement);
    } else {
        console.error("El renderizador no está disponible.");
    }
}
function clearObjects() {
    objectsToAnimate.forEach((object) => {
        render?.Scene.remove(object.mesh); // Eliminar el objeto de la escena
    });
    objectsToAnimate = []; // Limpiar la lista de objetos
}