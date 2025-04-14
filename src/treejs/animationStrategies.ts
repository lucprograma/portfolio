import * as THREE from 'three';
import { randFloat } from 'three/src/math/MathUtils.js';
interface AnimationStrategy{
    (instance: THREE.Mesh, delta: number): void;
}
const cubeStrategy: AnimationStrategy = (instance: THREE.Mesh, delta: number) => {
    instance.rotation.x += delta * 0.2;
    instance.rotation.y += delta * 0.2;
    instance.rotation.z += delta * 0.2;
}
const orbStrategy: AnimationStrategy = (instance: THREE.Mesh, delta: number) => {
    const angleOffset = instance.userData.angleOffset
    const radius = instance.userData.radius
    const time = Date.now() * 0.001;
    const angle = time + angleOffset; // Usar el offset para la rotación 
    instance.rotation.y += 0.01; // Rotación constante en el eje Y
    instance.position.x = Math.sin(angle) * radius; // Movimiento circular en el eje X
    instance.position.z = Math.cos(angle) * radius; // Movimiento circular en el eje Z
    
};
type MeshWithStrategy = {
    mesh: THREE.Mesh;
    strategy: AnimationStrategy;
};

const objectFactory = (type: 'cube' | 'orb',pos: THREE.Vector3 = new THREE.Vector3(0,0,0), scale: number = 1): MeshWithStrategy => {
    switch (type) {
        case 'cube': {
            const geometry = new THREE.BoxGeometry(scale, scale, scale);
            const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;
            mesh.position.set(pos.x, pos.y, pos.z);
            return { mesh, strategy: cubeStrategy };
        }
        case 'orb': {
            const randNumber = Math.random()  
            const randScale = randFloat(0.1, 0.3);
            const geometry = new THREE.SphereGeometry(randScale, 32, 32);
            const material = new THREE.MeshStandardMaterial({   color: 0xff0000,         // Rojo
                emissive: 0xff0000,      // Brillo del mismo color
                emissiveIntensity: 2.5,  // Más brillo
                transparent: true,
                opacity: 0.8,});
            const mesh = new THREE.Mesh(geometry, material);
            const angleOffset = Math.random() * Math.PI * 2; // Offset aleatorio para la rotación
            mesh.userData.angleOffset = angleOffset; // Guardar el offset en userData
            mesh.userData.radius = 4
            mesh.position.set(pos.x, pos.y, pos.z);
            return { mesh, strategy: orbStrategy };
        }
        default:
            throw new Error('Tipo de objeto no soportado');
    }
};

export { objectFactory };
export type { AnimationStrategy, MeshWithStrategy };