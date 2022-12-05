import * as THREE from './three.module.js'
import { OrbitControls } from './OrbitControls.js'

// File: js/View3dTHREE.js
// Dependencies : import them before View3d.js in browser （Using THREE.js)
// If not modules, import three.js

// View3d
function View3d(modele, canvas3dElt) {
  // Instance variables
  var model = modele;
  var canvas3d = canvas3dElt;
  var nbFacesVertice = 0;


  //  Three: initialisation
  const renderer = new THREE.WebGLRenderer({ canvas: canvas3d });
  let rendererWidth = canvas3d.clientWidth
  let aspectRatio = canvas3d.clientWidth / canvas3d.clientHeight
  renderer.setSize(rendererWidth, rendererWidth / aspectRatio);
  renderer.setClearColor(0x88ff88)

  //  Three: camera
  const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 20000);
  camera.position.set(0, 0, 800);
  camera.lookAt(0, 0, 0);

  //  Three: Scene
  const scene = new THREE.Scene();

  //  Three: lighting
  var light = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(light)

  var light1 = new THREE.PointLight(0xffffff, 0.9)
  light1.position.set(-300, -300, 800)
  scene.add(light1)

  var light2 = new THREE.PointLight(0xffffff, 0.9)
  light2.position.set(-300, -300, -800)
  scene.add(light2)


  //  Three: custom geometry
  //  (Using custom bufferGeometry will be faster; will look into it if time permits)
  //  https://r105.threejsfundamentals.org/threejs/lessons/threejs-custom-geometry.html
  //  https://r105.threejsfundamentals.org/threejs/lessons/threejs-custom-buffergeometry.html

  const geometry = new THREE.BufferGeometry();
  initBuffers();
  function initBuffers() {
    // Keep the geometry parts as-is
    // Also used in Orisim3d.js
    // Faces
    var vtx = []; // vertex
    var ftx = []; // front texture coords
    var btx = []; // back texture coords
    var fnr = []; // front normals coords
    var bnr = []; // back normals coords Not used for now
    var fin = []; // front indices
    var bin = []; // back indices
    var index = 0;

    for (var iFace = 0; iFace < model.faces.length; iFace++) {
      var f = model.faces[iFace];
      var pts = f.points;
      // Normal needed for Offset and used for lightning
      f.computeFaceNormal();
      var n = f.normal;
      // Triangle FAN can be used only because of convex CCW face
      var c = pts[0]; // center
      var p = pts[1]; // previous
      for (var i = 2; i < pts.length; i++) {
        var s = f.points[i]; // second
        vtx.push(c.x + f.offset * n[0]);
        vtx.push(c.y + f.offset * n[1]);
        vtx.push(c.z + f.offset * n[2]);
        fnr.push(n[0]); fnr.push(n[1]); fnr.push(n[2]);
        bnr.push(-n[0]); bnr.push(-n[1]); bnr.push(-n[2]);
        // // textures
        ftx.push((200 + c.xf) / View3d.wTexFront);
        ftx.push((200 + c.yf) / View3d.hTexFront);
        btx.push((200 + c.xf) / View3d.wTexBack);
        btx.push((200 + c.yf) / View3d.hTexBack);
        // index
        fin.push(index);
        bin.push(index);
        index++;
        vtx.push(p.x + f.offset * n[0]);
        vtx.push(p.y + f.offset * n[1]);
        vtx.push(p.z + f.offset * n[2]);
        fnr.push(n[0]); fnr.push(n[1]); fnr.push(n[2]);
        bnr.push(-n[0]); bnr.push(-n[1]); bnr.push(-n[2]);
        // // textures
        ftx.push((200 + p.xf) / View3d.wTexFront);
        ftx.push((200 + p.yf) / View3d.hTexFront);
        btx.push((200 + p.xf) / View3d.wTexBack);
        btx.push((200 + p.yf) / View3d.hTexBack);
        // index Note +1 for back face index
        fin.push(index);
        bin.push(index + 1);
        index++;
        vtx.push(s.x + f.offset * n[0]);
        vtx.push(s.y + f.offset * n[1]);
        vtx.push(s.z + f.offset * n[2]);
        fnr.push(n[0]); fnr.push(n[1]); fnr.push(n[2]);
        bnr.push(-n[0]); bnr.push(-n[1]); bnr.push(-n[2]);
        // // textures
        ftx.push((200 + s.xf) / View3d.wTexFront);
        ftx.push((200 + s.yf) / View3d.hTexFront);
        btx.push((200 + s.xf) / View3d.wTexBack);
        btx.push((200 + s.yf) / View3d.hTexBack);
        // index Note -1 for back face index
        fin.push(index);
        bin.push(index - 1);
        index++;
        // next triangle
        p = s;
      }
    }

    // Make into arrays
    var vertices = new Float32Array(vtx);
    var normals = new Float32Array(fnr);
    var texCoordsFront = new Float32Array(ftx);
    var texCoordsBack = new Float32Array(btx);

    const positionNumComponents = 3;
    const normalNumComponents = 3;
    const uvNumComponents = 2;

    // "addAttribute" hasbeen changed to setAttribute
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(vertices), positionNumComponents));
    geometry.setAttribute(
      'normal',
      new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
    geometry.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array(texCoordsFront), uvNumComponents));


    var faceVertexIndicesArray = new Uint8Array(fin);

    // Used in draw()
    nbFacesVertice = faceVertexIndicesArray.length;
  }

  // Textures/materials
  const loader = new THREE.TextureLoader();
  // const texture = loader.load('../textures/back.jpg');


  // Require CORS
  // View3d.imageFront.src = './textures/front.jpg';
  // Does not require CORS, use if image is inlined in html
  View3d.imageFront = new Image();
  if (window.document.getElementById("front")) {
    View3d.imageFront.src = window.document.getElementById("front").src;
    View3d.wTexFront = View3d.imageFront.width;
    View3d.hTexFront = View3d.imageFront.height;
  }


  // Require CORS
  // View3d.imageBack.src = './textures/back.jpg';
  // Does not require CORS if image is inlined
  View3d.imageBack = new Image();
  if (window.document.getElementById("back")) {
    View3d.imageBack.src = window.document.getElementById("back").src;
  }


  initBuffers();

  let color = 0xDD33DD;
  const materialFront = new THREE.MeshLambertMaterial({ color: color, side: THREE.FrontSide });

  //  Generate the mesh for paper!!
  const paper = new THREE.Mesh(geometry, materialFront) // Front and back materials

  // Generate Backside
  var materialBack = new THREE.MeshLambertMaterial({ color: 0xAAAAAA, side: THREE.BackSide });
  var backMesh = new THREE.Mesh(geometry, materialBack);
  paper.add(backMesh);

  // Add wireframe
  var wireMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
  var wireMesh = new THREE.Mesh(geometry, wireMaterial)
  paper.add(wireMesh)

  // Add to scene
  paper.position.x = 0;
  scene.add(paper);



  // Three: Orbit Controls
  // controls
  let controls = new OrbitControls( camera, renderer.domElement );
  controls.listenToKeyEvents( window ); // optional

  //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.1;
  controls.screenSpacePanning = false;
  controls.minDistance = 100;
  controls.maxDistance = 1000;
  controls.maxPolarAngle = Math.PI / 2;


  

  // Three: Render
  function draw() {
    renderer.render(scene, camera);
    controls.update();
  }



  // API
  this.initBuffers = initBuffers;
  this.draw = draw;

}

// Custom Shaders
// https://madebyevan.com/shaders/grid/
var vertexShader = `
    varying vec3 vertex
    void main()	{
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `;
var fragmentShader = `
    //#extension GL_OES_standard_derivatives : enable
    
    varying vec3 vertex;
    uniform float thickness;
    
    float edgeFactor(vec3 p){
      vec3 grid = abs(fract(p - 0.5) - 0.5) / fwidth(p) / thickness;
      return min(min(grid.x, grid.y), grid.z);
    }
    
    void main() {
      
      float a = edgeFactor(vUv);
      
      vec3 c = mix(vec3(1), vec3(0), a);
      
      gl_FragColor = vec4(c, 1.0);
    }
  `;



// Current rotation angle ([x-axis, y-axis] degrees)
View3d.currentAngle = [0.0, 0.0];
View3d.scale = 1.0;

// Projection and model view matrix for Perspective and Current
View3d.projectionMatrix = new Float32Array(16);
View3d.modelViewMatrix = new Float32Array(16);

// Textures dimensions
View3d.wTexFront = 1;
View3d.hTexFront = 1;
View3d.wTexBack = 1;
View3d.hTexBack = 1;

//   // Just for Node.js
//   if (NODE_ENV === true && typeof module !== 'undefined' && module.exports) {
//     module.exports = View3d;
//   }
export default View3d