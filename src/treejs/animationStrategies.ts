import * as THREE from 'three';
interface AnimationStrategy{
    (instance: THREE.Mesh, delta: number): void;
}
const cubeStrategy: AnimationStrategy = (instance: THREE.Mesh, delta: number) => {
    instance.rotation.x += delta * 0.2;
    instance.rotation.y += delta * 0.2;
    instance.rotation.z += delta * 0.2;
}
const orbStrategy: AnimationStrategy = (instance: THREE.Mesh, delta: number) => {
    instance.rotation.y += 0.01; // Rotación constante en el eje Y
    instance.position.x = Math.sin(Date.now() * 0.001) * 2; // Movimiento circular en el eje X
    instance.position.z = Math.cos(Date.now() * 0.001) * 2; // Movimiento circular en el eje Z
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
            const geometry = new THREE.SphereGeometry(scale, 32, 32);
            const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(pos.x, pos.y, pos.z);
            return { mesh, strategy: orbStrategy };
        }
        default:
            throw new Error('Tipo de objeto no soportado');
    }
};

export { objectFactory };
export type { AnimationStrategy, MeshWithStrategy };