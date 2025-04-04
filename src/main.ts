import * as THREE from 'three'; // Importa la biblioteca Three.js
import './style.css'; // Importa el archivo CSS

// Crear la escena, la cámara y el renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const textureLoader = new THREE.TextureLoader();
camera.position.z = 5;
scene.background = textureLoader.load('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgM44z5na5aQGymKJqakPt0NPjtoCGUvxtBg&s'); // Fondo de la escena
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.getElementById('three-container');
if (container) {
    container.appendChild(renderer.domElement);
}
// Añadir una luz ambiental para iluminar toda la escena
const ambientLight = new THREE.HemisphereLight(0xfffff, 0xfffff); // Luz blanca suave
scene.add(ambientLight);

// Añadir una luz puntual para crear un efecto de iluminación más dinámico
const pointLight = new THREE.PointLight(0xffffff, 0x444444); // Luz blanca intensa
pointLight.position.set(5, 5, 5); // Posición de la luz
scene.add(pointLight);

// Crear un cubo luminoso azul
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({
    color: 0x0000ff, // Azul
    emissive: 0x0000ff, // Emisión de luz azul
    emissiveIntensity: 1, // Intensidad de la emisión
    metalness: 0.2, // Efecto metálico
    roughness: 0.7, // Rugosidad
});
const cube = new THREE.Mesh(geometry, material);
const cube1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), material);
const cube2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), material);
const listCubes = [cube, cube1, cube2];
cube.position.set(5, -2, 0); 
cube1.position.set(3, 0, 0);
cube2.position.set(5.5, 1, 0);
randomRotation(listCubes); // Llamar a la función de rotación aleatoria
// Añadir los cubos a la escena
scene.add(cube);
scene.add(cube1)
scene.add(cube2)
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

    listCubes.forEach(rotatingCube => {
        rotatingCube.rotation.x += delta * 0.2
        rotatingCube.rotation.y += delta * 0.2
    });

    renderer.render(scene, camera);
}

animate();

// Ajustar el tamaño del renderizador al cambiar el tamaño de la ventana
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);