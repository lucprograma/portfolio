import * as THREE from 'three';
class RendererManager {
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    constructor(container: HTMLElement) {
        const textureLoader = new THREE.TextureLoader();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        if(container) {
            container.appendChild(this.renderer.domElement);
        }
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        this.scene.background = textureLoader.load('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgM44z5na5aQGymKJqakPt0NPjtoCGUvxtBg&s'); // Fondo de la escena
        const ambientLight = new THREE.HemisphereLight(0xfffff, 0xfffff); // Luz blanca suave
        this.scene.add(ambientLight);
    }
    get Renderer(): THREE.WebGLRenderer {
        return this.renderer;
    }
    get Scene(): THREE.Scene {
        return this.scene;
    }
    get Camera(): THREE.PerspectiveCamera {
        return this.camera;
    }
    public onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
export default RendererManager;