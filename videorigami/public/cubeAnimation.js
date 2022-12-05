import * as THREE from './three.module.js'

let canvasElement = document.getElementById("test")
let containerElement  = document.getElementById("container")
const renderer = new THREE.WebGLRenderer({canvas: canvasElement});
let rendererWidth = containerElement.clientWidth
let aspectRatio = containerElement.clientWidth / containerElement.clientHeight
renderer.setSize( rendererWidth, rendererWidth / aspectRatio );
renderer.setClearColor(0x88ff88)

const camera = new THREE.PerspectiveCamera( 45, aspectRatio, 0.1, 20000 );
camera.position.set( 0, 0, 50 );
camera.lookAt( 0, 0, 0 );

//  Responsive window 
window.addEventListener("resize", () => {
    rendererWidth = containerElement.clientWidth
    aspectRatio = containerElement.clientWidth / containerElement.clientHeight
    renderer.setSize(rendererWidth, rendererWidth / aspectRatio);
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
});

//  Create scene
const scene = new THREE.Scene();

//  Add lighting
var light = new THREE.AmbientLight(0xff0000, 0.1)
scene.add(light)
var light1 = new THREE.PointLight(0xffffff, 1.0)
light1.position.set(-10, -10, 10)
scene.add(light1)

// Add the cube
var material = new THREE.MeshLambertMaterial();
var cubeGeometry = new THREE.BoxGeometry( 10, 10, 10 );
var cube = new THREE.Mesh( cubeGeometry, material );
cube.position.set(0,0,-40);
scene.add( cube );		

//  Add outline
var outlineMaterial2 = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
// var cubeGeometryMerged = BufferGeometryUtils.mergeVertices(cubeGeometry);
var outlineMesh2 = new THREE.Mesh( cubeGeometry, outlineMaterial2 );

outlineMesh2.scale.multiplyScalar(1.1);
outlineMesh2.name = 'outline'
cube.add( outlineMesh2 );

function rotateMesh(mesh) {
    mesh.rotation.x += 0.01
    mesh.rotation.y += 0.01
    mesh.rotation.z += 0.01
}

function animate(t) {
    requestAnimationFrame( animate );
    rotateMesh(cube) 
    renderer.render( scene, camera );
}

animate()