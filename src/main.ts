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
            loadContent(targetId, contentContainer, onLoaded ? [onLoaded] : []); 
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
// Crear un cubo luminoso azul
// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshStandardMaterial({
//     color: 0x0000ff, // Azul
//     emissive: 0x0000ff, // Emisión de luz azul
//     emissiveIntensity: 1, // Intensidad de la emisión
//     metalness: 0.2, // Efecto metálico
//     roughness: 0.7, // Rugosidad
// });
// const cube = new THREE.Mesh(geometry, material);
// const cube1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), material);
// const cube2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), material);
// const listCubes = [cube, cube1, cube2];
// cube.position.set(5, -2, 0); 
// cube1.position.set(3, 0, 0);
// cube2.position.set(5.5, 1, 0);
// randomRotation(listCubes); // Llamar a la función de rotación aleatoria
// // Añadir los cubos a la escena
// render?.Scene.add(cube);
// render?.Scene.add(cube1)
// render?.Scene.add(cube2)
//Funcion rotacion random para los cubos
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
    const cube1 =  objectFactory('cube', new THREE.Vector3(5, -2, 0));
    const cube2 = objectFactory('cube', new THREE.Vector3(3, 0, 0), 0.7);
    const cube3 =  objectFactory('cube', new THREE.Vector3(5.5, 1, 0), 0.5);
    objectsToAnimate = [cube1, cube2, cube3];
    objectsToAnimate.forEach((object) => {
        console.log(object)
        render?.Scene.add(object.mesh); // Añadir el objeto a la escena
    })
    const sceneContainer = document.getElementById('three-container');
    if (sceneContainer) {
        sceneContainer.innerHTML = ''; // Limpiar el contenedor antes de cargar la escena
        if (render?.Renderer.domElement) {
            sceneContainer.appendChild(render.Renderer.domElement); // Añadir el renderizador al contenedor
        }
    }
}
function clearObjects() {
    objectsToAnimate.forEach((object) => {
        render?.Scene.remove(object.mesh); // Eliminar el objeto de la escena
    });
    objectsToAnimate = []; // Limpiar la lista de objetos
}